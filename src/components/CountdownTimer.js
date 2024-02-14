import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { Pressable, Text, View } from 'react-native'
import ModalSessionComplete from './modals/ModalSessionComplete'
import { useState } from 'react'
import { playSoundEndSessions } from '../logic/useSound'
import { formatTime, timerCompleted } from '../logic/countdownTimerLogic'

export default function CountdownTimer ({timer, setIsTimerHidden, selectedPet, setSelectedPet, onPress, setIsTimerOn}) {
  const [modalVisible, setModalVisible] = useState(false) 
  const [timeFocused, setTimeFocused] = useState(null)

  function children ({remainingTime}) {
    return formatTime({remainingTime})
  }

  async function onComplete (value) {
    setTimeFocused(value)
    await timerCompleted (selectedPet, value, setSelectedPet)
    playSoundEndSessions()
    setModalVisible(true)
  }

  return (
    <View style={{flex:1, justifyContent: "flex-end", alignItems: "center", paddingBottom: 36}} >
      <CountdownCircleTimer
        isPlaying
        duration={timer}
        colors={'#232b2b'}
        rotation="counterclockwise"
        onComplete={(value) => onComplete(value)}>
        {({ remainingTime }) => <Text style={{fontSize: 26, fontWeight: 700}}>{children({remainingTime})}</Text>}
      </CountdownCircleTimer>
      <Pressable onPress={onPress} style={{marginTop: 156, width: 100, height: 30, borderWidth: 2, borderColor: "rgba(211,211,211, 0.9)", borderRadius: 6, alignItems: "center", justifyContent: "center"}}>
        <Text>Cancel</Text>
      </Pressable>

      <ModalSessionComplete modalVisible={modalVisible} setModalVisible={setModalVisible} pet={selectedPet} timeFocused={timeFocused} setIsTimerHidden={setIsTimerHidden} setIsTimerOn={setIsTimerOn} />

    </View>
  )
}
import { useState, useEffect, useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Pressable, AppState } from 'react-native'
import CountdownTimer from '../components/CountdownTimer'
import {Header} from "../components/Header"
import {PetDisplayMain} from "../components/PetDisplay"
import ModalPets from '../components/modals/ModalPets'
import 'react-native-get-random-values'
import {getPetData, sortPets} from "../logic/setPetDataSorted"
import { playSoundError, playSoundStart } from '../logic/useSound'
import { StatsGained } from '../components/modals/ModalSessionComplete'
import ASSETS from '../constants/assetsData'
import Slider from '@react-native-community/slider'


export default function MainScreen ({coins, gems, petsOwnedOnLoad, setIsTimerOn}) {

	const [timer, setTimer] = useState(25 * 60)
	const [isTimerHidden, setIsTimerHidden] = useState(true)
	const [modalVisible, setModalVisible] = useState(false)
	const [selectedPet, setSelectedPet] = useState(null)
	const [petsOwned, setPetsOwned] = useState(sortPets(petsOwnedOnLoad))

	const appState = useRef(AppState.currentState)

	useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      console.log('AppState', appState.current);
    })

    return () => {
      subscription.remove()
    }
  }, [])
		
  useEffect(() => {
    const unsubscribe = getPetData(setPetsOwned)
    return () => unsubscribe()
  }, [])

	function selectPet (pet) {
		setSelectedPet(pet)
		setModalVisible(false)
	}

	function cancel () {
		setIsTimerHidden(true)
		setIsTimerOn(false)
		playSoundError()
	}

	function formatTime (time) {
    const minutes = Math.floor(time / 60)
    return minutes < 10 ? `0${minutes}:00` : `${minutes}:00`
  }

	function onStartLogic () {
		if (!selectedPet) {
			playSoundError()
		} else {
			playSoundStart()
			setIsTimerHidden(false)
			setIsTimerOn(true)
		}
	}

	return (
		<View style={styles.container}>
			<Header coinsOnLoad={coins} gemsOnLoad={gems} />

			{isTimerHidden ? (
				<View style={{flex: 1, alignItems: "center"}}>
					<Text style={{fontSize: 14, marginTop: 16}}>Start your focus session to grow your pet</Text>
					<Text style={{fontWeight: 700, fontSize: 36, marginTop: 36}}>{formatTime(timer)}</Text>
					<Slider style={{width: 250, height: 40}} minimumValue={1} maximumValue={120} step={5} value={timer/60} onValueChange={(value) => setTimer(value * 60)} minimumTrackTintColor="black"/>

					<ModalPets modalVisible={modalVisible} setModalVisible={setModalVisible} petsOwned={petsOwned} selectPet={selectPet} />

					<Pressable onPress={() => setModalVisible(true)}>
						<View style={{width: 140, height: 180, paddingTop: 14, marginVertical: 18, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(211,211,211, 0.6)", borderWidth: 2, borderColor: "rgba(211,211,211, 0.9)"}}>
						{selectedPet !== null
							? <View style={{left: 5}}>
									<PetDisplayMain pet={selectedPet} isPetSelected={true} />
								</View>
							: <Text>Select a Pet</Text>
						}
						</View>
					</Pressable>

					<View style={{backgroundColor: "#02748D", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 22, alignItems: "center", width: 140}}>
						<StatsGained imageSource={ASSETS.icons.collectionIconNav} isCoins={false} timeFocused={timer}/>
            <StatsGained imageSource={ASSETS.icons.coin} isCoins={true} timeFocused={timer}/>
					</View>
					<Pressable onPress={onStartLogic}	style={{width: 140, alignItems: "center", backgroundColor: "#232b2b", paddingVertical: 8, paddingHorizontal: 26, borderRadius: 8, marginTop: 16, borderWidth: 2, borderColor: "rgba(211,211,211, 0.9)"}}>
						<Text style={{color: "white", fontSize: 16, fontWeight: 700}}>Start</Text>
					</Pressable>
				</View>
				) : (
					<CountdownTimer timer={timer} setIsTimerHidden={setIsTimerHidden} selectedPet={selectedPet} setSelectedPet={setSelectedPet} onPress={cancel} setIsTimerOn={setIsTimerOn}/>
				)}

			<StatusBar hidden={true} />
		</View>
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: "#30bced",
    alignItems: 'center',
    paddingHorizontal: 15, 
		paddingTop: 15
  },  
})

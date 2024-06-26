import { View, Text, Image, Pressable, StyleSheet, Modal, ActivityIndicator } from 'react-native'
import { GameCurrencyUI } from '../Header'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { buyEgg } from '../../logic/buyInShop'
import ASSETS from '../../constants/assetsData'

export default function ModalBuyEgg({modalVisible, setModalVisible, getPet, rarity, cost, imageSource, setIsNewPet, setNumberCardsReceived, setErrorModalVisible, setGemsReceived}) {
  const [isLoading, setIsLoading] = useState(false)
  
  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center", padding: 15,}}>
            <Text style={{color: "white"}}>Buy {rarity} Egg</Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Ionicons name="close-sharp" size={32} color="white" />
            </Pressable>
          </View>

          <View style={{borderRadius: 12, backgroundColor: "#232b2b", padding: 12, marginBottom: 12, borderWidth: 2, borderColor: "rgba(211,211,211, 0.9)"}}>
            <Image source={imageSource} resizeMode='contain' style={{width: 160, height: 160, borderRadius: 12}} />
          </View>

          <View style={{alignItems: "center"}}>
            <Text style={{fontWeight: 700}}>{rarity === "Uncommon" 
                    ? "70% chance to get a Common Pal" 
                    : rarity === "Rare" 
                      ? "60% chance to get an Uncommon Pal"
                      : rarity === "Epic" 
                        ? "50% chance to get a Rare Pal"
                        : "40% chance to get an Epic Pal"}
            </Text>
            <Text style={{fontWeight: 700}}>{rarity === "Uncommon" 
                    ? "30% chance to get an Uncommon Pal" 
                    : rarity === "Rare" 
                      ? "40% chance to get a Rare Pal"
                      : rarity === "Epic" 
                        ? "50% chance to get an Epic Pal"
                        : "60% chance to get a Legendary Pal"}
            </Text>
          </View>
 
          {isLoading 
            ? <ActivityIndicator size={"large"} color={"black"} /> 
            : <Pressable onPress={() => buyEgg(cost, rarity, setIsNewPet, getPet, setGemsReceived, setNumberCardsReceived, setErrorModalVisible, setIsLoading, setModalVisible)} 
                  style={{minWidth: "80%", marginHorizontal: 12, alignItems: "center", backgroundColor: "#232b2b", paddingVertical: 8, borderRadius: 8, marginTop: 12, borderWidth: 2, borderColor: "rgba(211,211,211, 0.9)"}}>
                <View style={{width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18}}>
                  <GameCurrencyUI imageSource={ASSETS.icons.coin} amount={cost} size={50} width={80} backgroundColor = "#02748D" />
                  <Text style={{color: "white", fontSize: 14, fontWeight: 700}}>Buy Egg</Text>
                </View>
              </Pressable>
          }

        </View>
      </View>
    </Modal>
    
  )
}

const styles = StyleSheet.create({
	centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(100, 100, 100, 0.6)",
  },
  modalView: {
		backgroundColor: "#30bced",
    width: 320,
		paddingBottom: 12,
    borderRadius: 8,
    borderWidth: 2, 
    borderColor: "rgba(211,211,211, 0.9)",
    alignItems: 'center',
  },
  
})

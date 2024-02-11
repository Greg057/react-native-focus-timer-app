import { FlatList, Text, View, ImageBackground, Pressable  } from "react-native"
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { Image } from 'expo-image'
import XPDisplay from "./XPDisplay"

export function PetDisplay({petsOwned, selectPet}) {
	
	return (
    <FlatList showsVerticalScrollIndicator={false} numColumns={3}
				data={petsOwned} renderItem={({item}) => <PetDisplayMain pet={item} selectPet={selectPet}/>} keyExtractor={() => uuidv4()}/>
	)
}

export function PetDisplayMain ({pet, selectPet = null, isPetSelected = false, isPetUpgrade = false}) {
	
	function Children () {
		return(
			<View style={{paddingTop: 10, paddingHorizontal: 10, marginBottom: 18}}>
				<ImageBackground style={{width: 90, height: 123}} source={pet.petImage}>
					<Image style={{width: 110, height: 140, position: "absolute", left: -10, top: -10}} source={pet.frameImage} />
					<StarsDisplay stars={pet.stars} />
					<LevelDisplay level={pet.level} />
				</ImageBackground>
				{!isPetUpgrade && <XPDisplay pet={pet} disableUp={selectPet || isPetSelected} />}
			</View>
		)
	}
	return (
		selectPet ? <Pressable onPress={() => selectPet(pet)}><Children /></Pressable> : <Children />
	)
}

function StarsDisplay ({stars}) {
	let starsDisplay = []
	for (let i = 0; i < stars; i++) {
		const leftPosition = i * 10
		starsDisplay.push(<Image key={uuidv4()} style={{width: 18, height: 18, position: "absolute", left: leftPosition, top: -5}} source={require("../../assets/images/star.png")} />)
	}
  return (
		<View>
			{starsDisplay}
		</View>
 )
}

function LevelDisplay({level}) {
	return (
		<View style={{alignItems: "center", justifyContent: "center", borderRadius: "50%", width: 20, height: 20, backgroundColor: "#232b2b", position: "absolute", right: -5, top: -5}}>
			<Text style={{color: "white", fontWeight: 700, fontSize: 11}}>{level}</Text>
		</View>
	)
}


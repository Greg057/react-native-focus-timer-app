import { Text, View } from "react-native"
import { Header } from "../components/Header"
import { PetDisplay } from "../components/PetDisplay"
import { useEffect, useState } from "react"
import { getPetData, sortPets } from "../logic/setPetDataSorted"
import { SafeAreaView } from "react-native-safe-area-context"

export default function CollectionScreen ({petsOwnedOnLoad}) {
	const [petsOwned, setPetsOwned] = useState(sortPets(petsOwnedOnLoad))
	const [numberPetsDiscovered, setNumberPetsDiscovered] = useState(0)
		
  useEffect(() => {
    const unsubscribe = getPetData(setPetsOwned, setNumberPetsDiscovered)
    return () => unsubscribe()
  }, [])
		
	return (
		<SafeAreaView style={{backgroundColor: "black", flex: 1, paddingHorizontal: 15, paddingBottom: 60}}>
			<Header />
			<View style={{ backgroundColor: "#232b2b", marginBottom: 12, flexDirection: "row", justifyContent: "space-between", padding: 12, borderRadius: 8}}>
				<Text style={{color: "white", fontWeight: "bold"}}>Pals Collected</Text>
				<Text style={{color: "white"}}>Discovered: {numberPetsDiscovered}/50</Text>
			</View>
			
			<PetDisplay petsOwned={petsOwned} />
		
		</SafeAreaView>
	)
}
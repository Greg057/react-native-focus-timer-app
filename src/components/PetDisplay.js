import { FlatList } from "react-native"
import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { FIREBASE_DB } from "../../firebaseConfig"
import { getAuth } from "firebase/auth"
import { useEffect, useState } from "react"
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import PETS from "../../petsData"
import PetDisplayMain from "./PetDisplayMain"

export default function PetDisplay({petsOwnedOnLoad, selectPet}) {
	const [petsOwned, setPetsOwned] = useState(sortPets(petsOwnedOnLoad))

  useEffect(() => {
		onSnapshot(doc(FIREBASE_DB, "users", getAuth().currentUser.uid), (document) => {
			async function getPets() {
				const pets = document.data().petsOwned
				let dataToReturn = []
				const petPromises = Object.keys(pets).map(async (pet) => {
					const petRef = await getDoc(doc(FIREBASE_DB, "pets", pet))
					for (let i = 0; i < pets[pet].timesOwned; i++) {
						const data = {
							...petRef.data(),
							id: i,
							xp: pets[pet].xp[i],
							level: pets[pet].level[i],
							stars: pets[pet].stars[i],
							petImage: PETS[pet].image,
							frameImage: PETS[pet].frame
						}
						dataToReturn.push(data)
					}
				})
				await Promise.all(petPromises)
				setPetsOwned(sortPets(dataToReturn))
			}
			getPets()
		})

	}, [])

	function sortPets(arr) {
		const newArr = arr.sort((a, b) => {
			const rarityComparison = getRarityRank(b.rarity) - getRarityRank(a.rarity);
			const starsComparison = b.stars - a.stars;
			const levelComparison = b.level - a.level;
			return rarityComparison !== 0 ? rarityComparison : starsComparison !== 0 ? starsComparison : levelComparison;
		})
		return newArr
	}

	function getRarityRank(rarity) {
		const rarityOrder = {
			"Legendary": 5,
			"Epic": 4,
			"Rare": 3,
			"Uncommon": 2,
			"Common": 1
		}
		return rarityOrder[rarity]
	}

 return (
    <FlatList showsVerticalScrollIndicator={false} numColumns={3}
				data={petsOwned} renderItem={({item}) => <PetDisplayMain pet={item} selectPet={selectPet} />} keyExtractor={() => uuidv4()}/>
  )
}



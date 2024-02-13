import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from '@react-navigation/stack'
import MainScreen from "./src/screens/MainScreen"
import ShopScreen from "./src/screens/ShopScreen"
import CollectionScreen from "./src/screens/CollectionScreen"
import { Image } from "react-native"
import { useState, useEffect } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { FIREBASE_DB } from "./firebaseConfig"
import { getAuth, onAuthStateChanged } from "@firebase/auth"
import PETS from "./petsData"

import * as SplashScreen from 'expo-splash-screen'
import { Asset } from 'expo-asset'

SplashScreen.preventAutoHideAsync()

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()


export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  const [petsOwnedOnLoad, setPetsownedOnLoad] = useState([]);
  const [coins, setCoins] = useState()
	const [gems, setGems] = useState() 

  const [isTimerOn, setIsTimerOn] = useState(false) 


  useEffect(() => {
    const fetchData = async (user) => {
      if (user) {
        try {
          const document = await getDoc(doc(FIREBASE_DB, "users", user.uid))
          setCoins(document.data().coins)
          setGems(document.data().gems)
          const pets = document.data().petsOwned
          let dataToReturn = []
          const petPromises = Object.keys(pets).map(async (pet) => {
            const petRef = await getDoc(doc(FIREBASE_DB, "pets", pet))
            const data = {
              ...petRef.data(),
              xp: pets[pet].xp,
              level: pets[pet].level,
              stars: pets[pet].stars,
              petImage: PETS[pet].image,
              frameImage: PETS[pet].frame
            }
            dataToReturn.push(data)
          })

          await Promise.all(petPromises)
          setPetsownedOnLoad(dataToReturn)
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
    }

    const authNewUser = async () => {
      const auth = getAuth()
      const user = await signInAnonymously(auth)
      await setDoc(doc(FIREBASE_DB, "users", user.user.uid), {
        petsOwned: {},
        coins: 100,
        gems: 20,
      })
      fetchData(user.user)
    }

    function cacheImages(images) {
      return images.map(image => {
        if (typeof image === 'string') {
          return Image.prefetch(image)
        } else {
          return Asset.fromModule(image).downloadAsync()
        }
      })
    }

    async function loadResourcesAndDataAsync() {
      try {
        const promises = Object.keys(PETS).map(pet => PETS[pet].image)
        const res = await Promise.all(promises)
        const imageAssets = cacheImages([...res,
          require("./assets/frames/Common.png"),
          require("./assets/frames/Uncommon.png"),
          require("./assets/frames/Rare.png"),
          require("./assets/frames/Epic.png"),
          require("./assets/frames/Legendary.png"),
          require("./assets/eggs/blue.jpg"),
          require("./assets/eggs/green.jpg"),
          require("./assets/eggs/orange.jpg"),
          require("./assets/eggs/purple.jpg"),
          require("./assets/images/coin.png"),
          require("./assets/images/collectionIconNav.png"),
          require("./assets/images/gem.png"),
          require("./assets/images/homeIconNav.png"),
          require("./assets/images/shopIconNav.png"),
        ])
        await Promise.all([...imageAssets])
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      (async () => {
        await loadResourcesAndDataAsync()
        if (!user) {
          await authNewUser()
        } else {
          await fetchData(user)
        } 
        setAppIsReady(true)
        SplashScreen.hideAsync()
      })()
    })

    return () => {
      unsubscribe()
    }
  }, [])


  if (!appIsReady) {
    return null;
  }

  return (
    
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Timer" screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarActiveBackgroundColor: "#30bced", tabBarStyle: {height: 60, backgroundColor: "#02748D"}}}>
        {!isTimerOn && <Tab.Screen name="Shop" component={ShopScreen} options={{tabBarIcon: () => <Image style={{ width: 60, height: 60}} source={require("./assets/images/shopIconNav.png")}/>}} />}
        <Tab.Screen name="Timer" children={()=><MainScreen coins={coins} gems={gems} petsOwnedOnLoad={petsOwnedOnLoad} setIsTimerOn={setIsTimerOn}/>} options={{tabBarItemStyle: {borderRightColor: "rgba(211,211,211, 0.9)", borderRightWidth: 1, borderLeftColor: "rgba(211,211,211, 0.9)", borderLeftWidth: 1}, tabBarIcon: () => <Image style={{ width: 60, height: 60}} source={require("./assets/images/homeIconNav.png")}/>}} />
        {!isTimerOn && <Tab.Screen name="Collection" children={()=><CollectionScreen petsOwnedOnLoad={petsOwnedOnLoad}/>} options={{tabBarIcon: () => <Image style={{ width: 60, height: 60}} source={require("./assets/images/collectionIconNav.png")}/>}} />}
      </Tab.Navigator>
    </NavigationContainer>
    
  )
}

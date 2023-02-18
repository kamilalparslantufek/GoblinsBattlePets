import 'react-native-gesture-handler';
import { useEffect, useState, useRef } from 'react';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { ActivityIndicator, StyleSheet, Text, View, Button, TextInput, Image, VirtualizedList } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import Home from './screens/Home'
import Register from './screens/Register';
import Login from './screens/Login';
import styles from './styles/styles'

function Logout({navigation}){
  auth()
  .signOut()
  .then(() => {
    navigation.navigate(Home);
  })
  .catch((err) =>
  {
    crashlytics().log(`tried to logout when not logged in`);
    crashlytics().recordError(err);
    navigation.navigate(Home);
  })
}

const Drawer = createDrawerNavigator();

export default function App() {
  const [currentUser, setUser] = useState();
  const isFirstInitialization = useRef(true);
  // function onAuthStateChanged(currentUser){
  //     setUser(currentUser);
  // }
  // useEffect(() => {
  //     const sub = auth().onAuthStateChanged(onAuthStateChanged);
  //     return sub;
  // })

  return (
    <NavigationContainer>
        {currentUser == undefined ? 
          <Drawer.Navigator initialRouteName="Home"  useLegacyImplementation={true}>
              <Drawer.Screen name="Home" component = { Home } />
              <Drawer.Screen name="Login" component = { Login } />
              <Drawer.Screen name="Register" component = { Register } />
              <Drawer.Screen name="Logout" component={ Logout } />
          </Drawer.Navigator>
        :
          <Drawer.Navigator initialRouteName="Home"  useLegacyImplementation={true}>
            <Drawer.Screen name="Home" component = { Home } />
          </Drawer.Navigator>
        }
    </NavigationContainer>
  );
}
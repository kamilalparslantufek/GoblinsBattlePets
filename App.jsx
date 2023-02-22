import 'react-native-gesture-handler';
import { useEffect, useState, useRef } from 'react';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Alert, AppRegistry } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { firebase } from '@react-native-firebase/app-check';
import Home from './screens/Home'
import Register from './screens/Register';
import Login from './screens/Login';
import List from './screens/List'
import Profile from './screens/Profile'
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);


function Logout({navigation}){
  auth()
  .signOut()
  .then(() => {
    navigation.navigate("Home");
  })
  .catch((err) =>
  {
    crashlytics().log(`tried to logout when not logged in`);
    crashlytics().recordError(err);
    navigation.navigate("Home");
  })
}

const Drawer = createDrawerNavigator();

export default function App() {
    
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage)
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);


  function onAuthStateChanged(currentUser){
      setUser(currentUser);
  }
  useEffect(() => {
      const sub = auth().onAuthStateChanged(onAuthStateChanged);
      return sub;
  })
  const [isLoading, setLoading] = useState();
  const [currentUser, setUser] = useState();
  const isFirstInitialization = useRef(true);
  const [renderRoute, setRenderRoute] = useState();
  // this piece of code makes the main app to re render after registering and logging in, and blocks user from other actions
  // i was using this to update the navigation options but need to find another way now
  
 

  return (    
    <NavigationContainer>
      {/* <Drawer.Navigator useLegacyImplementation={true}>
                  <Drawer.Screen name="Home" component = { Home } />
                  <Drawer.Screen name="Login" component = { Login } />
                  <Drawer.Screen name="Register" component = { Register } />
                  <Drawer.Screen name="List" component = { List } />
                  <Drawer.Screen name="Logout" component={ Logout } />
                  <Drawer.Screen name="Profile" component={ Profile} />
      </Drawer.Navigator> */}
            {
              currentUser == undefined ? (
                <Drawer.Navigator useLegacyImplementation={true}>
                  <Drawer.Screen name="Home" component = { Home } />
                  <Drawer.Screen name="Login" component = { Login } />
                  <Drawer.Screen name="List" component = { List } />
                  <Drawer.Screen name="Register" component = { Register } />
                </Drawer.Navigator> 
              )
              :
              (
                <Drawer.Navigator initialRouteName='Profile' useLegacyImplementation={true}>
                  <Drawer.Screen name="Home" component = { Home } />
                  <Drawer.Screen name="Profile" component = { Profile } />
                  <Drawer.Screen name="List" component = { List } />
                  <Drawer.Screen name="Logout" component={ Logout } />
                </Drawer.Navigator>
              )
            }
    </NavigationContainer>
  );
}
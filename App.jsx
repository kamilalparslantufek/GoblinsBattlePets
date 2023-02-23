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
import ResetPassword from './screens/ResetPassword';
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
  //routing
  const[initialRoute, setInitialRoute] = useState('Home');  


  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
    });
    return unsubscribe;
  }, []);


  function onAuthStateChanged(currentUser){
      setUser(currentUser);
      if(currentUser) setInitialRoute("Profile");
  }
  useEffect(() => {
      const sub = auth().onAuthStateChanged(onAuthStateChanged);
      return sub;
  })
  const [currentUser, setUser] = useState();
 

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
                <Drawer.Navigator initialRouteName={initialRoute} useLegacyImplementation={true}>
                  <Drawer.Screen name="Home" component = { Home } />
                  <Drawer.Screen name="Login" component = { Login } />
                  <Drawer.Screen name="List" component = { List } />
                  <Drawer.Screen name="Register" component = { Register } />
                  <Drawer.Screen options={{drawerItemStyle: {height:0}}} name ="ResetPassword" component={ResetPassword}/>
                </Drawer.Navigator> 
              )
              :
              (
                <Drawer.Navigator initialRouteName={initialRoute} useLegacyImplementation={true}>
                  <Drawer.Screen options={{drawerItemStyle: {height:0}}} name ="ResetPassword" component={ResetPassword}/>
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
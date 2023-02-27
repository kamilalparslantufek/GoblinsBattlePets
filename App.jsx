import 'react-native-gesture-handler';
import { useEffect} from 'react';
//firebase and notifications
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Alert, AppRegistry } from 'react-native';
//views + navigator
import { createDrawerNavigator, DrawerContentScrollView,DrawerItemList,DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Home from './screens/Home'
import Register from './screens/Register';
import Login from './screens/Login';
import List from './screens/List'
import Profile from './screens/Profile'
import ResetPassword from './screens/ResetPassword';
import Logout from './screens/Logout';
//redux
import { useDispatch,useSelector,Provider } from 'react-redux';
import { setUserValue, setStatus, getUserValue, getUserStatus } from './core/redux/userSlice';
import { store } from './core/redux/store';
import { SinglePet } from './screens/SinglePet';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

export default AppWrapper = () =>{
  //redux
  return(
    <Provider store={store}>
        <App/>
    </Provider>
  )
}


const Drawer = createDrawerNavigator();
const App = () =>  {
  
  const initialRoute = 'Home';
  const dispatch = useDispatch();
  // const navigation = useNavigation();

  useEffect(() => {
    if(auth().currentUser == null ){
      dispatch(setUserValue(undefined))
      dispatch(setStatus("offline"))
    }
    else{
      dispatch(setUserValue(auth().currentUser))
      dispatch(setStatus("online"))
    }
  }, []);
  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log("app opened", remoteMessage.notification);
      if(useSelector((state) => getUserStatus(states)) == "online")
      {
        // navigation.navigate('SinglePet', {id:remoteMessage.data.id});
      }
      else{
        // navigation.navigate('Login');
      }
    })

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log(remoteMessage);
    });
    return unsubscribe;
  });
  //


messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(remoteMessage);
})

// function CustomDrawerContent(props) {
//   if(useSelector((state) => getUserStatus(state)) == "online")
//   {
//     return (
//       <DrawerContentScrollView {...props}>
//       <DrawerItemList {...props} />
//       <DrawerItem label="Logout" drawerItemStyle={{height: useSelector((state) => getUserStatus(state))=="online" ? 45 : 0 }} onPress={() => NavigationContainer.} />
//     </DrawerContentScrollView>
//   );
//   }
//   else{
//     return (
//       <DrawerContentScrollView {...props}>
//       <DrawerItemList {...props} />
//     </DrawerContentScrollView>
//     )
//   }
// }
  //
  return (
    <NavigationContainer>
              <Drawer.Navigator initialRouteName={initialRoute} useLegacyImplementation={true}>
                <Drawer.Screen name="Home" component = { Home } />
                <Drawer.Screen options={{drawerItemStyle: {height: useSelector((state) => getUserStatus(state))=="online" ? 45 : 0 }}} name="Profile" component = { Profile } /> 
                <Drawer.Screen options={{drawerItemStyle: {height: useSelector((state) => getUserStatus(state))=="offline" ? 45 : 0 }}}name="Login" component = { Login } />
                <Drawer.Screen options={{drawerItemStyle: {height: useSelector((state) => getUserStatus(state))=="online" ? 45 : 0 }}}name="List" component = { List } />
                <Drawer.Screen options={{drawerItemStyle: {height: useSelector((state) => getUserStatus(state))=="offline" ? 45 : 0 }}}name="Register" component = { Register } />
                <Drawer.Screen options={{drawerItemStyle: {height: useSelector((state) => getUserStatus(state))=="online" ? 45 : 0 }}}name="Logout" component={ Logout } /> 
                <Drawer.Screen options={{drawerItemStyle: {height: 0}}} name ="ResetPassword" component={ResetPassword}/>
                <Drawer.Screen options={{drawerItemStyle: {height: 0}}} name = "SinglePet" component= {SinglePet}/>
              </Drawer.Navigator> 
  </NavigationContainer>
      
  );
}
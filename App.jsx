import 'react-native-gesture-handler';
import { useEffect, useState, useRef } from 'react';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { ActivityIndicator, StyleSheet, Text, View, Button, TextInput, Image, VirtualizedList } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home'
import Register from './screens/Register';
import styles from './styles/styles'

function Logout({navigation}){
  auth()
  .signOut()
  .then(() => {
    navigation.navigate(Home);
  })
}

function Login({navigation}){
  const [loginSelection, setLoginMethod] = useState(0);
  const [isButtonsVisible, setButtonVisibility] = useState(true);
  const [phoneNumberState, setPhoneNumberState] = useState("");
  const [phoneConfirmCodeState, setConfirmCodeState] = useState("");
  const [phoneConfirmationState, setConfirmation] = useState(null);
  const [emailTextState, setEmailState] = useState("");
  const [passwordTextState, setPasswordState] = useState("");
  const [errorStatus, setErrorState] = useState(false);

  async function EmailLogin(){
    auth().signInWithEmailAndPassword(emailTextState,passwordTextState)
      .then((res) => {
        console.log(res);
        // navigation.navigate(Home)
      })
      .catch((err) => {
          setErrorState(true);
          crashlytics().log("invalid email & password")
          crashlytics().recordError(err)
      });
  }

  async function SendAuthCodePhone(phoneNumber){
    try{
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation(confirmation);
      setButtonVisibility(false);
    }
    catch(err){
      crashlytics().log(`Invalid Phone Number.`);
      setButtonVisibility(true);
    }
  }

  async function confirmPhoneCode(){
    try{
      const res=await phoneConfirmationState.confirm(phoneConfirmCodeState);
      console.log(res);
      // navigation.navigate(Home);
      // bu kısım içinde login işlemi gerçekleşiyor kod doğru girilmişse
    }
    catch(err){
      setErrorState(true);
      console.log('invalid code.');
      crashlytics().log("invalid code entered");
      crashlytics().recordError(err);
    }
  }
  return(
    <View style = {styles.container}>
      {
        loginSelection == 0 ? 
        (
          <View key="email" style = {styles.loginContainer}>
          <Text style = { styles.loginTitle}>Login Using Your Email & Password</Text>
          <TextInput  
          style = {styles.input}
          placeholderTextColor = "#ddd"
          placeholder = "email"
          onChangeText={(text) => setEmailState(text)}>
          </TextInput>
          <TextInput 
          secureTextEntry = {true}
          style = {styles.input}
          placeholderTextColor = "#ddd"
          placeholder = "password"
          onChangeText={(text) => setPasswordState(text)}>
          </TextInput>
          { errorStatus ? (<Text>Check your email & password.</Text>) : null}
          <Button title='Login' onPress={() => { EmailLogin()}}></Button>
        </View>
        ) :
        (
          !phoneConfirmationState ? (
            <View key="phone" style = {styles.loginContainer}>
              <Text style= {styles.loginTitle}>Login Using Your Phone Number</Text>
              <TextInput  
              style = {styles.input}
              placeholderTextColor = "#ddd"
              placeholder = "Phone Number"
              onChangeText={(text) => setPhoneNumberState(text)}>
              </TextInput>
            <Button title='Send Authentication Code' onPress={() => { SendAuthCodePhone(phoneNumberState)}}/>
          </View>
           ) : (
            <View key="confirmCode" style = {styles.loginContainer}>
              <Text style= {styles.loginTitle}>Enter your 6 digit code below.</Text>
              <TextInput
              style = {styles.input}
              placeholderTextColor = "#ddd"
              placeholder = ""
              onChangeText={text => setConfirmCodeState(text)}
              ></TextInput>
              <Button title='Confirm Code' onPress={()=> confirmPhoneCode()}></Button>
            </View>
           )
        )
      }
      {
        isButtonsVisible ? (
          <View>
            <View key="loginBtns" style = {styles.buttonGroup}>
              <Button style = {styles.buttonGroupButton} title='Email' onPress={() => {setLoginMethod(0); navigation.navigate('Login');}}></Button>
              <Button style = {styles.buttonGroupButton} title='Phone Number' onPress={() => {setLoginMethod(1); navigation.navigate('Login');;}} ></Button>
            </View>
            <View key="register" style= {{ paddingTop: '5%'}}>
              <Button style={styles.registerFormButton} title='Register' onPress={ () => { navigation.navigate(Register)} }></Button>
            </View>
          </View>
        )
        : (null)
      }
    </View>
    )
}

const Drawer = createDrawerNavigator();
export default function App() {
  const [currentUser, setUser] = useState();
  function onAuthStateChanged(currentUser){
    setUser(currentUser);
  }
  // useEffect(() => {
  //   const sub = auth().onAuthStateChanged(onAuthStateChanged);  
  //   return sub;
  // })

  return (
    <NavigationContainer>
        {currentUser == undefined ? 
          <Drawer.Navigator initialRouteName="Home"  useLegacyImplementation={true}>
              <Drawer.Screen name="Home" component = { Home } />
              <Drawer.Screen name="Login" component = { Login } />
              <Drawer.Screen name="Register" component = { Register } />
          </Drawer.Navigator>
        :
          <Drawer.Navigator initialRouteName="Home"  useLegacyImplementation={true}>
            <Drawer.Screen name="Home" component = { Home } />
            <Drawer.Screen name="Logout" component={ Logout } />
          </Drawer.Navigator>
        }
    </NavigationContainer>
  );
}
import 'react-native-gesture-handler';
import { useEffect, useState, useRef } from 'react';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { ActivityIndicator, StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home'

// just trying out flow of the phone number login 
function LoginGoogle(){
}

function LoginPhone({ navigation }){
  const [phoneNumberState, setPhoneNumberState] = useState("");
  const [confirmCodeState, setConfirmCodeState] = useState("");
  const [confirmationState, setConfirmation] = useState(null);

  async function SendAuthCodePhone(phoneNumber){
    console.log(phoneNumber);
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirmation(confirmation);
  }
  async function confirmCode(){
    console.log(confirmCodeState);
    try{
      const res=await confirmationState.confirm(confirmCodeState);
      console.log(res);
      navigation.navigate(Home);  
      // bu kısım içinde login işlemi gerçekleşiyor kod doğru girilmişse
    }
    catch(err){
      console.log('invalid code.');
      crashlytics().log("invalid code entered");
      crashlytics().recordError(err);
    }
  }

  return(
    !confirmationState ? (
      <View key="phone" style = {styles.container}>
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
      <View key="confirmCode">
        <Text style= {styles.loginTitle}>Enter your 6 digit code below.</Text>
        <TextInput
        style = {styles.input}
        placeholderTextColor = "#ddd"
        placeholder = "Phone Number"
        onChangeText={text => setConfirmCodeState(text)}
        ></TextInput>
        <Button title='Confirm Code' onPress={()=> confirmCode()}></Button>
      </View>
     )
  )
}
/* importing crashlytics does not work with the expo go app, so i will try to import both authentication and crashlytics tomorrow. */
function sendSMSCode(){

}

function LoginEmail(){
  const [phoneNumberState, setPhoneNumberState] = useState("");
  const [confirmCodeState, setConfirmCodeState] = useState("");
  const [confirmationState, setConfirmation] = useState(null);
  return (
    <View key="email" style = {styles.loginContainer}>
      <Text style = { styles.loginTitle}>Login Using Your Email & Password</Text>
      <TextInput  
      style = {styles.input}
      placeholderTextColor = "#ddd"
      placeholder = "email">
      </TextInput>
      <TextInput 
      secureTextEntry = {true}
      style = {styles.input}
      placeholderTextColor = "#ddd"
      placeholder = "password">
      </TextInput>
      <Button title='Login'></Button>
    </View>
    )
}

function Login({navigation}){
  const [loginSelection, setLoginMethod] = useState(0);
  let ret;
  if(loginSelection == 0) ret = LoginEmail();
  if(loginSelection == 1) ret = LoginPhone();
  let buttons = <View key="loginBtns" style = {styles.buttonGroup}>
     <Button style = {styles.buttonGroupButton} title='Email' onPress={() => {setLoginMethod(0); navigation.navigate('Login');}}></Button>
     <Button style = {styles.buttonGroupButton} title='Phone Number' onPress={() => {setLoginMethod(1); navigation.navigate('Login');;}} ></Button>
  </View>
  return [ret, buttons]
}

const Drawer = createDrawerNavigator();
export default function App() {
  useEffect(() => {
    crashlytics().recordError(new Error('app mounted? '));
  }, [])
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home"  useLegacyImplementation={true}>
        <Drawer.Screen name="Home" component = { Home } />
        <Drawer.Screen name="Login" component = { Login } />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer:{
    flex: 0.5,
    backgroundColor: '#777',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:'25%'
  },
  containerinfo:{
    flexDirection: 'row',
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonGroup:{
      flex: 0.5,
      paddingBottom: 100,
      flexDirection: 'row',
      backgroundColor : '#777',
      alignItems: 'center',
      justifyContent: 'center'
  },
  buttonGroupButton:{
      border: 0,
      shadowOffset: 0,
  },
  input: {
    color: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    height: 40,
    width: '60%',
    marginBottom: '3%',
    paddingLeft: '1%'
  },
  loginTitle: {
    padding: '3%',
    color: '#fff',
  }
});
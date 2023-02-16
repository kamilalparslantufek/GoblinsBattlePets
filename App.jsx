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
function Login({navigation}){
  const [loginSelection, setLoginMethod] = useState(0);
  const [isButtonsVisible, setButtonVisibility] = useState(true);
  const [phoneNumberState, setPhoneNumberState] = useState("");
  const [phoneConfirmCodeState, setConfirmCodeState] = useState("");
  const [phoneConfirmationState, setConfirmation] = useState(null);

  async function SendAuthCodePhone(phoneNumber){
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirmation(confirmation);
    setButtonVisibility(false);
  }

  async function confirmPhoneCode(){
    console.log(phoneConfirmCodeState);
    try{
      const res=await phoneConfirmationState.confirm(phoneConfirmCodeState);
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
    <View style = {styles.container}>
      {
        loginSelection == 0 ? 
        (
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
            <View key="confirmCode">
              <Text style= {styles.loginTitle}>Enter your 6 digit code below.</Text>
              <TextInput
              style = {styles.input}
              placeholderTextColor = "#ddd"
              placeholder = "Phone Number"
              onChangeText={text => setConfirmCodeState(text)}
              ></TextInput>
              <Button title='Confirm Code' onPress={()=> confirmPhoneCode()}></Button>
            </View>
           )
        )
      }
      {
        isButtonsVisible ? (
          <View key="loginBtns" style = {styles}>
            <Button style = {styles.buttonGroupButton} title='Email' onPress={() => {setLoginMethod(0); navigation.navigate('Login');}}></Button>
            <Button style = {styles.buttonGroupButton} title='Phone Number' onPress={() => {setLoginMethod(1); navigation.navigate('Login');;}} ></Button>
          </View>
        )
        : (null)
      }
    </View>
    )
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
    flex: 1,
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
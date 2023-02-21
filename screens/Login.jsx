import 'react-native-gesture-handler';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { Text, View, Button, TextInput } from 'react-native';
import Home from './Home'
import List from './List';
import Register from './Register';
import styles from '../styles/styles'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GoogleSignin, GoogleSigninButton} from '@react-native-google-signin/google-signin';
import { firebase } from '@react-native-firebase/app-check';
import {FIREBASE_APP_CHECK_DEBUG_TOKEN} from '@env'


GoogleSignin.configure({
  webClientId: '681058578312-c227o93h4k2l9dkdh0krb2ha76ef2ch4.apps.googleusercontent.com'
});

const Login = function Login({navigation}){
  const [loginSelection, setLoginMethod] = useState(0);
    const [isButtonsVisible, setButtonVisibility] = useState(true);
    const [phoneNumberState, setPhoneNumberState] = useState("");
    const [phoneConfirmCodeState, setConfirmCodeState] = useState("");
    const [phoneConfirmation, setConfirmation] = useState(null);
    const [emailTextState, setEmailState] = useState("");
    const [passwordTextState, setPasswordState] = useState("");
    const [errorStatus, setErrorState] = useState(false);
    const [isGoogleSignInProgress, setGoogleSignInState] = useState(false);
  
    async function GoogleLogin(){
      try{
        setGoogleSignInState(true);
        await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true})
        const result = await GoogleSignin.signIn();
        const credentials = await auth.GoogleAuthProvider.credential(result.idToken);
        await auth().signInWithCredential(credentials);
        navigation.navigate("List");
      }
      catch(err){
        console.log(err)
        setErrorState(true);
        crashlytics().log("could not login with google connection")
        crashlytics().recordError(err)
        setGoogleSignInState(false)
      }
    }

    async function EmailLogin(){
      try{
        auth().signInWithEmailAndPassword(emailTextState,passwordTextState)
            navigation.navigate("List")
      }  
      catch(err)
      {
        setErrorState(true);
        crashlytics().recordError(err)
        crashlytics().log("invalid email & password")
      }  
    }
  
    async function SendAuthCodePhone(phoneNumber){
      try{
        const rnfbProvider = firebase.appCheck().newReactNativeFirebaseAppCheckProvider();
        await rnfbProvider.configure({
          android:{
            provider: 'debug',
            debugToken: FIREBASE_APP_CHECK_DEBUG_TOKEN
          }
        });
        firebase.appCheck().initializeAppCheck({provider: rnfbProvider, isTokenAutoRefreshEnabled: false})
        .then(async () => {
          const confirmation = await auth().signInWithPhoneNumber(`+${phoneNumber}`);
          setConfirmation(confirmation);
          setButtonVisibility(false);  
        })
        .catch((err) =>{
          console.log(err);
          crashlytics().log("login error with phone");
          crashlytics().recordError(err);
        })
        }

      catch(err){
        console.log(err)
        crashlytics().log(`Invalid Phone Number.`);
        setButtonVisibility(true);
      }
    }
  
    async function confirmPhoneCode(){
      try{
        
        const res = await phoneConfirmation.confirm(phoneConfirmCodeState);
        navigation.navigate('List');
        // bu kısım içinde login işlemi gerçekleşiyor kod doğru girilmişse
      }
      catch(err){
        setErrorState(true);
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
            <View>
              <Button title='Login' onPress={() => { EmailLogin()}}></Button>
              <TouchableOpacity
              style={{justifyContent:'space-evenly'}}
              onPress={() => { navigation.navigate('Register')}}>
                <Text style={{color:'#fff'}}>or you can register here.</Text>
              </TouchableOpacity>
            </View>
          </View>
          ) :
          (
            !phoneConfirmation ? (
              <View key="phone" style = {styles.loginContainer}>
                <Text style= {styles.loginTitle}>Login Using Your Phone Number</Text>
                <Text style= {styles.loginTitle}>Enter your number with country code, without + sign.</Text>
                <TextInput  
                style = {styles.input}
                placeholderTextColor = "#ddd"
                placeholder = "Phone Number"
                onChangeText={(text) => setPhoneNumberState(text)}>
                </TextInput>
                <View>
                  <Button title='Send Authentication Code' onPress={() => { SendAuthCodePhone(phoneNumberState)}}/>
                  <TouchableOpacity
                  style={{justifyContent:'space-evenly'}}
                  onPress={() => { navigation.navigate(Register)}}>
                  <Text style={{color:'#fff'}}>or you can register here.</Text>
                  </TouchableOpacity>
                </View>
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
                <View style = {styles.buttonGroupButton}>
                <Button title='Email' onPress={() => {setLoginMethod(0); navigation.navigate('Login');}}></Button>
                </View>
                <View  style = {styles.buttonGroupButton}>
                <Button title='Phone Number' onPress={() => {setLoginMethod(1); navigation.navigate('Login');;}} ></Button>
                </View>
              </View>
              <View>
                <Text style={{textAlign:'center', padding: '2%', color:'#fff'}}> OR </Text>
                <GoogleSigninButton
                style={{ width: '100%', height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                disabled={isGoogleSignInProgress}
                onPress={() => GoogleLogin()}
                ></GoogleSigninButton>
              </View>
            </View>
          )
          : (null)
        }
      </View>
      )
  }



export default Login;
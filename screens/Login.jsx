import 'react-native-gesture-handler';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { Text, View, Button, TextInput } from 'react-native';;
import styles from '../styles/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GoogleSigninButton} from '@react-native-google-signin/google-signin';
import { loginWithEmailPassword,  googleSigninLogin }  from '../core/modules/firebase';
import {useDispatch} from 'react-redux';
import { setUserValue, setStatus } from '../core/redux/userSlice';

const Login = function Login({navigation})
{
  //page stuff
  const [errorStatus, setErrorState] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginSelection, setLoginMethod] = useState(0);
  const [isButtonsVisible, setButtonVisibility] = useState(true);
  //phone number
  const [phoneNumberState, setPhoneNumberState] = useState("");
  const [phoneConfirmCodeState, setConfirmCodeState] = useState("");
  const [phoneConfirmation, setConfirmation] = useState(null);
  //email login
  const [emailTextState, setEmailState] = useState("");
  const [passwordTextState, setPasswordState] = useState("");
  //google signin
  const [isGoogleSignInProgress, setGoogleSignInState] = useState(false);
  //redux
  const dispatch = useDispatch();
  function updateUserAfterLogin(){
    dispatch(setUserValue(auth().currentUser));
    dispatch(setStatus("online"))
  }

  //google login
  async function GoogleLogin(){
    try{
      setGoogleSignInState(true);
      const credentials = await googleSigninLogin();
      await auth().signInWithCredential(credentials);
      updateUserAfterLogin();
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
  //email
  async function EmailLogin(){
    try{
      await loginWithEmailPassword(emailTextState, passwordTextState)
      updateUserAfterLogin();
      navigation.navigate("List")
    }  
    catch(err)
    {
      console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)));
      setErrorState(true);
      crashlytics().log(err.message)
      crashlytics().recordError(err)

      if(err.message.includes("[auth/invalid-email]"))
        setErrorMessage("You have entered an invalid email.")
      
    }  
  }
  //phone
  async function SendAuthCodePhone(phoneNumber){
    try{
      // const rnfbProvider = firebase.appCheck().newReactNativeFirebaseAppCheckProvider();
      // await rnfbProvider.configure({
      //   android:{
      //     provider: 'debug',
      //     debugToken: FIREBASE_APP_CHECK_DEBUG_TOKEN
      //   }
      // });
      // firebase.appCheck().initializeAppCheck({provider: rnfbProvider, isTokenAutoRefreshEnabled: false})
      const confirmation = await auth().signInWithPhoneNumber(`+${phoneNumber}`, true);
      setConfirmation(confirmation);
      setButtonVisibility(false);  
      }
    catch(err){
      console.log(err);
      crashlytics().log(err.message);
      crashlytics().recordError(err);
      setButtonVisibility(true);
    }
  }

  async function confirmPhoneCode(){
    try{
      
      const res = await phoneConfirmation.confirm(phoneConfirmCodeState);
      console.log(res);
      updateUserAfterLogin();
      setConfirmation(null);
      setPhoneNumberState("");
      setConfirmCodeState("");
      setButtonVisibility(true);
      setConfirmation(undefined);
      navigation.navigate('List');
      // bu k??s??m i??inde login i??lemi ger??ekle??iyor kod do??ru girilmi??se
    }
    catch(err){
      console.log(err.code)
      setErrorState(true);
      setButtonVisibility(true);
      setConfirmation(undefined);
      setConfirmCodeState("");
      crashlytics().log("invalid code entered");
      crashlytics().recordError(err);
      setConfirmation(undefined);
    }
  }

  function resetPassword(){
    navigation.navigate('ResetPassword');
  }


  return(
    <View style = {styles.container}>
      {
        loginSelection == 0 ? 
        (
          <View key="email" style = {styles.loginContainer}>
          <Text style = { styles.loginTitle }>Login Using Your Email & Password</Text>
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
            onPress={() => {resetPassword()}}>
              <View>
                <Text style={{color:'#aaa'}}>Reset your password?</Text>
              </View>
            </TouchableOpacity>
            <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
              <View style={{flex:1,height:1, backgroundColor:'#aaa'}}></View>
              <Text style={{color:'#aaa'}}>OR</Text>
              <View style={{flex:1, height:1, backgroundColor:'#aaa'}}></View>
            </View>
            <TouchableOpacity
            style={{justifyContent:'space-evenly'}}
            onPress={() => { navigation.navigate('Register')}}>
              <Text style={{color:'#fff'}}>you can register here.</Text>
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
                onPress={() => { navigation.navigate('Register')}}>
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
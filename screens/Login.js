import 'react-native-gesture-handler';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { Text, View, Button, TextInput } from 'react-native';
import Home from './Home'
import Register from './Register';
import styles from '../styles/styles'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GoogleSignin, GoogleSigninButton} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '681058578312-c227o93h4k2l9dkdh0krb2ha76ef2ch4.apps.googleusercontent.com'
});


const Login = function Login({navigation}){
    const [loginSelection, setLoginMethod] = useState(0);
    const [isButtonsVisible, setButtonVisibility] = useState(true);
    const [phoneNumberState, setPhoneNumberState] = useState("");
    const [phoneConfirmCodeState, setConfirmCodeState] = useState("");
    const [phoneConfirmationState, setConfirmation] = useState(null);
    const [emailTextState, setEmailState] = useState("");
    const [passwordTextState, setPasswordState] = useState("");
    const [errorStatus, setErrorState] = useState(false);
  
    async function GoogleLogin(){
      try{
        const services = await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true})
        console.log(services)
        const result = await GoogleSignin.signIn();
        console.log(result.idToken)
        const credentials = auth.GoogleAuthProvider.credential(result.idToken);
        console.log(credentials)
        await auth().signInWithCredential(credentials);
        navigation.navigate(Home);
      }
      catch(err){
        console.log(err)
        setErrorState(true);
        crashlytics().log("could not login with google connection")
        crashlytics().recordError(err)
      }
    }

    async function EmailLogin(){
      auth().signInWithEmailAndPassword(emailTextState,passwordTextState)
        .then((res) => {
          navigation.reset({
            index:0,
            routes: [
                {name: 'Home'},
                {name: 'Logout'}
            ]
          })
          navigation.navigate(Home)
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
                <View style = {styles.buttonGroupButton}>
                <Button title='Email' onPress={() => {setLoginMethod(0); navigation.navigate(Login);}}></Button>
                </View>
                <View  style = {styles.buttonGroupButton}>
                <Button title='Phone Number' onPress={() => {setLoginMethod(1); navigation.navigate(Login);;}} ></Button>
                </View>
              </View>
              <View key='googleLogin'>
                <TouchableOpacity style={{backgroundColor:'#fff', paddingHorizontal:'5%', marginTop:'5%'}} onPress={() => { GoogleLogin() }}>
                    <Text>Login With Google</Text>
                </TouchableOpacity>
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



export default Login;
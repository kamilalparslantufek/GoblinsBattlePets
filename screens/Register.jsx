import 'react-native-gesture-handler';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { GoogleSignin, GoogleSigninButton} from '@react-native-google-signin/google-signin';
import { ActivityIndicator, Text, View, Button, TextInput, Image } from 'react-native';
import styles from '../styles/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import List from './List';
GoogleSignin.configure({
    webClientId: '681058578312-c227o93h4k2l9dkdh0krb2ha76ef2ch4.apps.googleusercontent.com'
});

 const Register = function Register({navigation}){
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [error, setErrorState] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [googleRegisterCredential, setGoogleRegisterCredential] = useState();
    const [emailDisabled, setEmailDisabled] = useState(false);
    const [isGoogleSignInProgress, setGoogleSignInState] = useState(false)
    const [registerMethod, setRegisterMethod] = useState(0)
    const [isButtonsVisible, setButtonVisibility] = useState(true)
    const [phoneConfirmation, setConfirmation] = useState()
    
    async function CreateUser() {
        try{
            setLoading(true)
            await auth().createUserWithEmailAndPassword(email,password);
            //if chosen method is the google verification, link account with google account
            if(googleRegisterCredential != undefined){
                try{
                    await auth().currentUser.linkWithCredential(googleRegisterCredential);
                    setLoading(false);
                    navigation.navigate("Profile")
                }
                catch(err){
                    crashlytics().log(`Account Linking Error`)
                    crashlytics().recordError(err)
                }
            }
            } 
        catch(err){
            crashlytics().log(`Signup Error`)
            crashlytics().recordError(err)
            setErrorState(true);
            setLoading(false);
        }
    }

    async function GoogleRegister(){
        try{
            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true})
            const result = await GoogleSignin.signIn();
            const credentials = auth.GoogleAuthProvider.credential(result.idToken);
            setGoogleRegisterCredential(credentials)
            setEmail(result.user.email)
            setEmailDisabled(true)
            setGoogleSignInState(true)
        }
        catch(err){
            crashlytics().log(`Could not create credential of the user.`);
            crashlytics().recordError(err);
            setGoogleSignInState(false)
            setEmailDisabled(false)
            navigation.navigate('Register');
        }
    }
    //phone
    async function VerifyPhone(){
        setLoading(true);
        try{
            const confirmation = await auth().verifyPhoneNumber(`+${phoneNumber}`);
            setConfirmation(confirmation);
            setLoading(true);
        }
        catch(err){
            crashlytics().log('verification message could not be sent.')
            crashlytics().recordError(err);
            setErrorState(true);
            setLoading(false);
        }
    }
    
    async function ConfirmCode(){
        setLoading(true)
        try{
            const credential = auth.PhoneAuthProvider.credential(confirmation.verificationId, verificationCode);
            try{
                await auth().currentUser.linkWithCredential(credential);
                setLoading(false)
                setPhoneLinkState(true)
                navigation.navigate('List')
            }catch{
                crashlytics().log(`linking error`)
                crashlytics().recordError(err);
                setErrorState(true)
                setLoading(false)
            }
        }
        catch(err){
            if(err.code == 'auth/invalid-verification-code'){
                crashlytics().log('invalid code');
            }
            else{
                crashlytics().log(`linking error`)
            }
            crashlytics().recordError(err);
            setErrorState(true)
            setLoading(false)

        }
    }
    return (
        <View style={ styles.container }>
        {isLoading
            ? (<ActivityIndicator/>)
            :  <View >
                    <View>
                        {registerMethod == 0?
                        (
                            <View style = { styles.RegisterForm }>
                                <Text style = {{ color:'white'} }>Register Using Your Email & Password</Text>
                                <TextInput  
                                style = {styles.registerInput}
                                placeholderTextColor = "#ddd"
                                placeholder = "Email"
                                inputMode='email'
                                value={email}
                                editable={!emailDisabled}
                                selectTextOnFocus={!emailDisabled}
                                onChangeText={(text) => setEmail(text)}>
                                </TextInput>
                                <TextInput 
                                secureTextEntry = {true}
                                style = {styles.registerInput}
                                placeholderTextColor = "#ddd"
                                placeholder = "Password"
                                onChangeText={(text) => setPassword(text)}>
                                </TextInput>
                                <Button style={styles.registerButton} title='Register' onPress={() => {CreateUser()}}></Button>
                                <Text style={{textAlign:'center', padding: '2%', color:'#fff'}}> OR </Text>
                                <TouchableOpacity onPress={() => {GoogleRegister()}}>
                                    <View style = {{backgroundColor: '#0066ff', borderRadius: 3, flexDirection: 'row', alignItems:'center'}}>
                                        <Image
                                        style = {{
                                            width: 40,
                                            height: 40,
                                            marginRight: '10%'
                                        }}
                                        source= {{uri : "https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"}}
                                        />
                                        <Text style={{color:'#fff'}}>Sign up with Google</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                        :(
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
                        )}
                        {isButtonsVisible?
                        (<View style ={{marginTop: '5%'}}>
                            <View style = {{justifyContent: 'center', alignItems:'center'}}>
                                <Text style = {{color:'white'}}> Sign up with</Text>
                            </View>
                            <View style = {{marginTop: '0.5%', flexDirection: 'row', justifyContent:'space-evenly'}}>
                                <TouchableOpacity onPress={() => {setRegisterMethod(0)}}>
                                    <View>
                                        <Text style= {{color:'#fff',borderWidth:1, backgroundColor:'#0066ff' ,borderColor:'#0066ff',borderRadius:3, padding:'0.5%'}}>with Email</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {setRegisterMethod(1)}}>
                                    <View>
                                        <Text style= {{color:'#fff',borderWidth:1,  backgroundColor:'#0066ff' ,borderColor:'#0066ff',borderRadius:3, padding: '0.5%'}}>with Phone</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        ) : (null)
                    }
                    </View>
        </View>
        }
        </View>
    )
}

export default Register;
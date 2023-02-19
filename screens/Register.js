import 'react-native-gesture-handler';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { GoogleSignin, GoogleSigninButton} from '@react-native-google-signin/google-signin';
import { ActivityIndicator, Text, View, Button, TextInput } from 'react-native';
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
    const [phoneConfirmForm, setPhoneConfirm] = useState(false);
    const [phoneConfirm, setConfirmation] = useState();
    const [verificationCode, setVerificationCode] = useState();
    const [googleRegisterCredential, setGoogleRegisterCredential] = useState();
    const [emailDisabled, setEmailDisabled] = useState(false);
    const [isGoogleSignInProgress, setGoogleSignInState] = useState(false)
    
    //after creating the account link it with phone number
    async function ConfirmCode(){
        setLoading(true)
        try{
            const credential = auth.PhoneAuthProvider.credential(phoneConfirm.verificationId, verificationCode);
            try{
                await auth().currentUser.linkWithCredential(credential);
                setLoading(false)
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
    //send phone number link verification code
    async function VerifyPhone(){
        setLoading(true);
        try{
            const confirmation = await auth().verifyPhoneNumber(`+${phoneNumber}`);
            setConfirmation(confirmation);
            setLoading(false);
        }
        catch(err){
            crashlytics().log('verification message could not be sent.')
            crashlytics().recordError(err);
            setErrorState(true);
            setLoading(false);
        }
    }
    //no phone linking
    async function ContinueWithoutVerification(){
        setPhoneConfirm(false)
        setConfirmation(undefined)
        navigation.navigate(List)
    }

    async function CreateUser() {
        try{
            setLoading(true)
            await auth().createUserWithEmailAndPassword(email,password);
            //if chosen method is the google verification, link account with google account
            if(googleRegisterCredential != undefined){
                try{
                    await auth().currentUser.linkWithCredential(googleRegisterCredential);
                }
                catch(err){
                    crashlytics().log(`Account Linking Error`)
                    crashlytics().recordError(err)
                }
            }
            setLoading(false);
            setPhoneConfirm(true);
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
            navigation.navigate(Register);
        }
    }

    return (
        <View style={ styles.container }>
        {isLoading
            ? (<ActivityIndicator/>)
            :  <View >
                {phoneConfirm == undefined ? (
                    <View>
                        {
                            phoneConfirmForm == false ?
                            (
                            <View style = { styles.RegisterForm}>
                                <Text style = { styles.loginTitle }>Register Using Your Email & Password</Text>
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
                                <GoogleSigninButton
                                style={{ width: '100%', height: 48 }}
                                size={GoogleSigninButton.Size.Wide}
                                color={GoogleSigninButton.Color.Dark}
                                disabled={isGoogleSignInProgress}
                                onPress={() => GoogleRegister()}
                                ></GoogleSigninButton>
                            </View>
                            )
                            :(
                            <View style = { styles.RegisterForm }>
                                <Text style = { styles.loginTitle }>You can verify your phone number for signing up with your phone number.
                                {`\n`}
                                Enter your number with your country code without + sign.</Text>
                                <TextInput 
                                style = {styles.registerInput}
                                placeholderTextColor = "#ddd"
                                placeholder = "Phone Number"
                                value={phoneNumber} 
                                onChangeText={(text) => {
                                    text = text.replace(/[^0-9]/g, '')
                                    setPhoneNumber(text)
                                    }}>
                                </TextInput>
                                <View style={styles.ButtonGroup}>
                                    <View style={styles.buttonGroupButton}>
                                        <Button title='Verify Phone Number' onPress={() => {VerifyPhone()}}></Button>
                                    </View>
                                    <View style={styles.buttonGroupButton}>
                                        <Button title='Continue Without Number' onPress={() => {ContinueWithoutVerification()}}></Button>    
                                    </View>
                                </View>
                            </View>
                            )
                        } 
                    </View>
                   ) 
                :(
                    <View>
                        <Text style = { styles.loginTitle }>Enter Verification Code.</Text>
                        <TextInput 
                        style = {styles.input}
                        placeholderTextColor = "#ddd"
                        placeholder = "Phone Number"
                        inputMode='numeric'
                        value={verificationCode} 
                        onChangeText={(text) => {
                            text = text.replace(/[^0-9]/g, '')
                            setVerificationCode(text)
                            }}>
                        </TextInput>
                        <Button style={styles.registerButton} title='Send' onPress={() => {ConfirmCode()}}></Button>
                    </View>
                )}
            
        </View>
        }
        </View>
       
    )
}

export default Register;
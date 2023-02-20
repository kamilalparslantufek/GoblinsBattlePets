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
    const [error, setErrorState] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [googleRegisterCredential, setGoogleRegisterCredential] = useState();
    const [emailDisabled, setEmailDisabled] = useState(false);
    const [isGoogleSignInProgress, setGoogleSignInState] = useState(false)

    //no phone linking
    // async function ContinueWithoutVerification(){
    //     setPhoneConfirm(false)
    //     setConfirmation(undefined)
    //     navigation.navigate('List')
    // }

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

    return (
        <View style={ styles.container }>
        {isLoading
            ? (<ActivityIndicator/>)
            :  <View >
                    <View>
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
                    </View>
        </View>
        }
        </View>
    )
}

export default Register;
import 'react-native-gesture-handler';
import { useState } from 'react';
import { firebase } from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { GoogleSignin, GoogleSigninButton} from '@react-native-google-signin/google-signin';
import { ActivityIndicator, Text, View, Button, TextInput, Image } from 'react-native';
import styles from '../styles/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import List from './List';
import auth from '@react-native-firebase/auth'
import { authenticateWithPhone, confirmPhoneCode, googleSigninLogin, googleSigninRegister, loginWithEmailPassword, registerWithEmailPassword } from '../core/modules/firebase_auth';
GoogleSignin.configure({
    webClientId: '681058578312-c227o93h4k2l9dkdh0krb2ha76ef2ch4.apps.googleusercontent.com'
});

 const Register = function Register({navigation}){
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [error, setErrorState] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [registerMethod, setRegisterMethod] = useState(0)
    const [isButtonsVisible, setButtonVisibility] = useState(true)
    const [confirmation, setConfirmation] = useState()
    const [confirmCode, setConfirmCode] = useState()
    
    async function CreateUser() {
        try{
            setLoading(true)
            await registerWithEmailPassword(email, password);
            navigation.navigate('Profile');
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
            const credentials = await googleSigninLogin();
            await auth().signInWithCredential(credentials);
            navigation.navigate('Home');
        }
        catch(err){
            console.log(err);
            crashlytics().log(err.message);
            crashlytics().recordError(err);
        }
    }
    //phone
    async function VerifyPhone(){
        setLoading(true);
        try{
            const confirmation = await authenticateWithPhone(phoneNumber);
            setConfirmation(confirmation);
            setLoading(false);
            setButtonVisibility(false);
        }
        catch(err){
            crashlytics().log('verification message could not be sent.')
            crashlytics().recordError(err);
            setErrorState(true);
            setLoading(false);
        }
    }
    async function phoneConfirmCode(){
        try{
            // bu kısım içinde login işlemi gerçekleşiyor kod doğru girilmişse
            const res = confirmPhoneCode(confirmCode,confirmation);
            navigation.navigate('List');
        }
        catch(err){
          setErrorState(true);
          crashlytics().log(err.message);
          crashlytics().recordError(err);
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
                             
                            </View>
                        )
                        :
                        (
                            (!confirmation ? 
                            (
                            <View key="phone" style = {[styles.RegisterForm]}>
                                <View style = {{marginBottom: '2%', alignItems:'center', justifyContent:'center'}}>
                                    <Text style= {styles.loginTitle}>Register Using Your Phone Number</Text>
                                    <Text style= {[styles.loginTitle, {fontSize:12}]}>Enter your number with country code, without + sign.</Text>
                                </View>
                                <TextInput  
                                style = {styles.registerInput}
                                placeholderTextColor = "#ddd"
                                placeholder = "Phone Number"
                                keyboardType='numeric'
                                onChangeText={(text) => setPhoneNumber(text)}>
                                </TextInput>
                                <View style= {{alignItems:'center'}}>
                                    <Button title='Send Authentication Code' onPress={() => { VerifyPhone()}}/>
                                </View>
                            </View>
                            ) : (
                            <View key="confirmCode" style = {styles.loginContainer}>
                                <Text style= {styles.loginTitle}>Enter your 6 digit code below.</Text>
                                <TextInput
                                style = {styles.input}
                                placeholderTextColor = "#ddd"
                                placeholder = ""
                                onChangeText={(text) => {
                                    text = text.replace(/[^0-9]/g, '')
                                    setConfirmCode(text)}}
                                ></TextInput>
                                <Button title='Confirm Code' onPress={()=> {phoneConfirmCode()}}></Button>
                            </View>
                                 )
                              )
                        )}
                        {isButtonsVisible?
                        (<View style ={{marginTop: '5%'}}>
                            <Text style={{textAlign:'center', padding: '2%', color:'#fff'}}> OR </Text>
                            <View style = {{alignItems:'center', justifyContent:'center'}}>
                                <TouchableOpacity onPress={() => {GoogleRegister()}}>
                                    <View style = {{backgroundColor: '#2196f3', borderRadius: 3, flexDirection: 'row', alignItems:'center', justifyContent:'space-between', paddingRight:'3%'}}>
                                        <Image
                                        style = {{
                                            width: 40,
                                            height: 40,
                                            backgroundColor: 'white',
                                            marginRight:'3%'
                                        }}
                                        source= {{uri : "https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"}}
                                        />
                                        <Text style={{color:'#fff'}}>Sign up with Google</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style = {{justifyContent: 'center', alignItems:'center'}}>
                                <View style = {{flexDirection:'row', alignItems:'center', width:'50%', paddingTop:'1%'}}>
                                    <View style={{flex:1, height:1, backgroundColor:'#aaa'}}></View>
                                    <Text style = {{color:'white', textTransform:'uppercase', marginHorizontal:'1%'}}>OR Sign up with</Text>
                                    <View style={{flex:1, height:1, backgroundColor:'#aaa'}}></View>
                                </View>
                            </View>
                            <View style = {{marginTop: '0.5%', flexDirection: 'row', alignItems:'center', justifyContent:'space-around'}}>
                                <TouchableOpacity  onPress={() => {setRegisterMethod(0)}}>
                                    <View style = {{alignItems:'center', justifyContent:'center'}}>
                                        <Text style= {{color:'#fff',borderWidth:1, backgroundColor:'#2196f3' ,borderColor:'#2196f3',borderRadius:3, paddingHorizontal:'3%', paddingVertical:'1%'}}>Email</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {setRegisterMethod(1)}}>
                                    <View style = {{alignItems:'center', justifyContent:'center'}}>
                                        <Text style= {{color:'#fff',borderWidth:1,  backgroundColor:'#2196f3' ,borderColor:'#2196f3',borderRadius:3, paddingHorizontal: '3%', paddingVertical:'1%'}}>Phone</Text>
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
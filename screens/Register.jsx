import 'react-native-gesture-handler';
import { useState } from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import { ActivityIndicator, Text, View, Button, TextInput, Image } from 'react-native';
import styles from '../styles/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import { authenticateWithPhone, confirmPhoneCode, googleSignInRegister, registerWithEmailPassword } from '../core/modules/firebase';
import {useDispatch} from 'react-redux';
import { setUserValue, setStatus } from '../core/redux/userSlice';

 const Register = function Register({navigation}){
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    
    const [error, setErrorState] = useState(false);

    const [isLoading, setLoading] = useState(false);
    const [registerMethod, setRegisterMethod] = useState(0);
    const [isButtonsVisible, setButtonVisibility] = useState(true);
    //phone
    const [confirmation, setConfirmation] = useState();
    const [confirmCode, setConfirmCode] = useState();
    //google
    const [googleRegisterOnProgress, setGoogleRegisterProgress] = useState(false);
    const [googleCredentials, setGoogleCredentials] = useState();
    //redux
    const dispatch = useDispatch();
    function updateUserAfterLogin(){
      dispatch(setUserValue(auth().currentUser));
      dispatch(setStatus("online"))
    }
      
    //email
    async function CreateUser() {
        try{
            setLoading(true)
            await registerWithEmailPassword(email, password);
            if(googleRegisterOnProgress){
                await auth().currentUser.linkWithCredential(googleCredentials.credentials)
            }
            updateUserAfterLogin();
            navigation.navigate('Profile');
        } 
        catch(err){
            console.log(err)
            crashlytics().log(`Signup Error`)
            crashlytics().recordError(err)
            setErrorState(true);
            setLoading(false);
        }
    }
    //google
    async function GoogleRegister(){
        try{
            setGoogleRegisterProgress(true)
            const credentials = await googleSignInRegister();
            setGoogleCredentials(credentials)
            setEmail(credentials.result.user.email)
        }
        catch(err){
            setGoogleRegisterProgress(false);
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
            setButtonVisibility(true);
            setConfirmation(undefined);
            setLoading(false);
        }
    }
    async function phoneConfirmCode(){
        try{
            // bu kısım içinde login işlemi gerçekleşiyor kod doğru girilmişse
            const res = confirmPhoneCode(confirmCode,confirmation);
            setConfirmation(undefined);
            setButtonVisibility(true);
            updateUserAfterLogin();
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
                                editable={!googleRegisterOnProgress}
                                selectTextOnFocus={!googleRegisterOnProgress}
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
                                <TouchableOpacity 
                                disabled = {googleRegisterOnProgress}
                                onPress={() => {GoogleRegister()}}>
                                    <View style = {[{backgroundColor: !googleRegisterOnProgress? '#2196f3' : '#ebebeb'}, { borderRadius: 3, flexDirection: 'row', alignItems:'center', justifyContent:'space-between', paddingRight:'3%'}]}>
                                        <Image
                                        style = {{
                                            width: 40,
                                            height: 40,
                                            backgroundColor: !googleRegisterOnProgress?'white' : '#ebebeb',
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
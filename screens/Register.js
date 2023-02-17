import 'react-native-gesture-handler';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { ActivityIndicator, Text, View, Button, TextInput } from 'react-native';
import styles from '../styles/styles';

const Register = function Register(){

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [error, setErrorState] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [phoneConfirmForm, setPhoneConfirm] = useState(false);
    const [phoneConfirm, setConfirmation] = useState();
    const [verificationCode, setVerificationCode] = useState();
    
    async function ConfirmCode(){
        try{
            const credential = auth.PhoneAuthProvider.credential(phoneConfirm.verificationId, verificationCode);
            await auth().currentUser.linkWithCredential(credential);
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
        }
    }
    async function VerifyPhone(){
        try{
            const confirmation = await auth().verifyPhoneNumber(phoneNumber);
            console.log(confirmation);
            setConfirmation(confirmation);
        }
        catch(err){
            crashlytics().log('verification message could not be sent.')
            crashlytics().recordError(err);
            setErrorState(true)
        }
    }

    async function CreateUser() {
        try{
            setLoading(true)
            await auth().createUserWithEmailAndPassword(email,password);
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

    return (
        <View style={ styles.container }>
        {isLoading
            ? (<ActivityIndicator/>)
            :  <View >
                {phoneConfirm == undefined ? (
                    <View>
                        <Text style = { styles.loginTitle }>Register Using Your Email & Password</Text>
                        {
                            phoneConfirmForm == false ?
                            (<View>
                                <TextInput  
                                style = {styles.input}
                                placeholderTextColor = "#ddd"
                                placeholder = "Email"
                                inputMode='email'
                                onChangeText={(text) => setEmail(text)}>
                                </TextInput>
                                <TextInput 
                                secureTextEntry = {true}
                                style = {styles.input}
                                placeholderTextColor = "#ddd"
                                placeholder = "Password"
                                onChangeText={(text) => setPassword(text)}>
                                </TextInput>
                                <Button style={styles.registerButton} title='Register' onPress={() => {CreateUser()}}></Button>
                            </View>
                            )
                            :(
                            <View>
                                <Text style = { styles.loginTitle }>Enter Your Phone Number.</Text>
                                <TextInput 
                                style = {styles.input}
                                placeholderTextColor = "#ddd"
                                placeholder = "Phone Number"
                                value={phoneNumber} 
                                onChangeText={(text) => {
                                    text = text.replace(/[^0-9+]/g, '')
                                    setPhoneNumber(text)
                                    }}>
                                </TextInput>
                                <Button style={styles.registerButton} title='Verify Phone Number' onPress={() => {VerifyPhone()}}></Button>
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
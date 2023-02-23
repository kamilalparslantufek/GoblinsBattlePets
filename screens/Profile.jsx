import 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { ActivityIndicator, Text, View, Button, TextInput,Alert } from 'react-native';
import styles from '../styles/styles';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { addEmailToAccount, sendEmailVerification, sendResetPassword } from '../core/modules/firebase';

const Profile = function Profile({navigation}){

    //
    const [isLoading, setLoading] = useState(true);
    const [currentUser, setUser] = useState();
    const [error, setErrorState] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    //google & email verification
    const [email, setEmail] = useState();
    const [isEmailEnabled, setEmailEnabled] = useState();
    const [isEmailVerificationSent, setEmailVerificationSent] = useState(false);
    const [isEmailVerified, setEmailVerified] = useState();
    const [isPasswordEnabled, setPasswordEnabled] = useState();
    //google
    const [isGoogleEnabled, setGoogleEnabled] = useState();
    
    //phone number related
    const [phoneNumber, setPhoneNumber] = useState();
    const [phoneLinkState, setPhoneLinkState] = useState(false);
    const [confirmation, setConfirmation] = useState();
    const [verificationCode, setVerificationCode] = useState();
    //
    
    const checkUserStatus = async () => {
        const user = auth().currentUser;
        console.log(user);
        setUser(user);
        if(user.phoneNumber != undefined){
            setPhoneLinkState(true)
            setPhoneNumber(user.phoneNumber)
        }
        else{
            setPhoneLinkState(false)
        }
        user.emailVerified? setEmailVerified(true) : setEmailVerified(false);
        if(user.email != undefined){
            setEmail(user.email);
            setEmailEnabled(true)
            try{
                const methods = await auth().fetchSignInMethodsForEmail(user.email);
                methods.includes("google.com") ? (setGoogleEnabled(true)) : (setGoogleEnabled(false));
                methods.includes("password") ? (setPasswordEnabled(true)) : (setPasswordEnabled(false));
            }
            catch(err){
                console.log(err);
                }
        }
        else{
            setEmailEnabled(false);
        }
        setLoading(false)
    };

    //email functions
    //add email
    async function addEmail(){
        try{
            await addEmailToAccount(currentUser,email);
            Alert.alert('GoblinsBattlePets', 'Check your email for setting a password.', [
                {
                    text: 'OK',
                    onPress: () => {},
                }
            ]);
            checkUserStatus();
        }
        catch(err){
            crashlytics().log(err.message);
            crashlytics().recordError(err);
        }
    }
    //send email verificatiion code
    async function sendVerification(){
        setEmailVerificationSent(true);
        try{
            await sendEmailVerification(currentUser);
            
        }
        catch(err){
            console.log(err)
        }
    }

    async function setPassword(){
        try{
            const methods = await auth().fetchSignInMethodsForEmail(currentUser.email);
            await sendResetPassword(currentUser);
            Alert.alert('GoblinsBattlePets', 'Check your email.', [{
                text: 'OK',
                onPress: () => {}
            }])
        }
        catch(err){
            console.log(err)
            crashlytics().log(err.message);
            crashlytics().recordError(err)
        }
    }

    //after creating the account link it with phone number
    async function confirmCode(){
        setLoading(true)
        try{

            const credential = auth.PhoneAuthProvider.credential(confirmation.verificationId, verificationCode);
            console.log(5)
            try{
                const rnfbProvider = firebase.appCheck().newReactNativeFirebaseAppCheckProvider();
                await rnfbProvider.configure({
                  android:{
                    provider: 'debug',
                    debugToken: FIREBASE_APP_CHECK_DEBUG_TOKEN
                  }
                });
                await firebase.appCheck().initializeAppCheck({provider: rnfbProvider, isTokenAutoRefreshEnabled: false})
                await auth().currentUser.linkWithCredential(credential);
                setLoading(false);
                setPhoneLinkState(true);
                navigation.navigate('List')
            }catch(err){
                crashlytics().log(`linking error`)
                crashlytics().recordError(err);
                setErrorState(true)
                setErrorMessage(`${errorMessage} \n ${err}`)
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
            setErrorMessage(`${errorMessage} \n ${err}`)
            crashlytics().recordError(err);
            setErrorState(true)
            setLoading(false)

        }
    }
    //send phone number link verification code
    async function verifyPhone(){
        setLoading(true);
        try{
            auth().verifyPhoneNumber(`+${phoneNumber}`)
                .then((res) => {
                    console.log(res)
                    setConfirmation(confirmation);
                    setLoading(true);
                })
        }
        catch(err){
            crashlytics().log(err.message);
            crashlytics().recordError(err);
            setErrorState(true);
            setErrorMessage(`${errorMessage} \n ${err}`)
            setLoading(false);
        }
    }
   
    //effects
    useEffect(() => {
        setLoading(true)
        checkUserStatus()
    }, [])

    return(
    <View style={{flex:1, backgroundColor: '#121212'}}>
        {isLoading ? 
        ( 
        <View>
            <ActivityIndicator/>
        </View>
        ) 
        : 
        ( 
            <View style = {{ marginHorizontal: '10%', marginVertical: '2%'}}>
                {/* header */}
                <View>
                    <View style = {{marginBottom:'5%'}}>
                        <Text style={{color:'white', fontSize:20}}>User Profile</Text>
                        <View style={{flexDirection:'row', alignItems:'center',  paddingTop:'1%'}}>
                            <View style={{flex:1, height:1, backgroundColor:'#aaa'}}></View>
                            <View style={{flex:1, height:1, backgroundColor:'#aaa'}}></View>
                        </View>
                    </View>
                </View>
                {/* email / password options */}
                <View>
                    {isEmailEnabled? 
                    (<View style={{marginVertical:'1%'}}>

                        <View>
                            <Text style={{color:'#aaa'}}>User</Text>
                            <Text style={{color:'white'}}>{currentUser.email}</Text>
                        </View>
                        {/* check if email is verified */}
                        {isEmailVerified? (
                            <View>
                                <Text style={{color:'#fff'}}>Your email is verified.</Text>
                            </View>
                        ) : (
                            <View>
                                {isEmailVerificationSent? (
                                    <Text style={{color:'#fff'}}>Check your mail for verification.</Text>
                                ) : (
                                    <TouchableOpacity onPress={() => {sendVerification()}}>
                                        <View>
                                            <Text style={{color:'#fff'}}>Click here to verify your email.</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}       
                            </View>
                        )}
                        {/* check if password is enabled */}
                        {isPasswordEnabled? (
                            <TouchableOpacity
                            onPress={() => {setPassword()}}>
                                <View>
                                    <Text style={{color:'#aaa'}}>Click here to reset your password.</Text>
                                </View>
                            </TouchableOpacity>
                        ):
                        (
                            <TouchableOpacity
                            onPress={() => {setPassword()}}>
                                <View>
                                    <Text style={{color:'#aaa'}}>Click here to set a password.</Text>
                                </View>
                            </TouchableOpacity>                            
                        )}
                    </View>
                    )
                    :(
                        <View>
                            <Text style={{color:'#aaa'}}>You can add and verify your email here.</Text>
                            <TextInput
                            value = {email}
                            onChangeText={(text) => {setEmail(text)}}
                            style = {{ color: '#fff',
                                borderWidth: 1,
                                borderColor: '#ddd',
                                height: 40,
                                width: '100%',
                                marginTop: "2%",
                                marginBottom: '3%',
                                paddingLeft: '1%'}}
                            placeholderTextColor = "#ddd"
                            placeholder = "Enter your email here"
                            >
                            </TextInput>
                            <TouchableOpacity
                            onPress={() => {addEmail()}}>
                                <View>
                                    <Text style={{color:'#fff'}}>UPDATE EMAIL</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                </View>
                <View>
                    {error ? (<Text style={{color:"white"}}>{errorMessage}</Text>) : (null)}
                </View>
                {/* phone */}
                <View>
                    {phoneLinkState==false? (
                    <View style={{marginTop:"2%"}}>
                        {confirmation == undefined ? (
                            <View>
                                <Text style = { styles.loginTitle }>You can verify your phone number for signing up with your phone number.
                                {`\n`}
                                Enter your number with your country code without + sign.</Text>
                                <TextInput 
                                style = {{ color: '#fff',
                                borderWidth: 1,
                                borderColor: '#ddd',
                                height: 40,
                                width: '100%',
                                marginTop: "2%",
                                marginBottom: '3%',
                                paddingLeft: '1%'}}
                                placeholderTextColor = "#ddd"
                                placeholder = "Phone Number"
                                value={phoneNumber} 
                                onChangeText={(text) => {
                                    text = text.replace(/[^0-9]/g, '')
                                    setPhoneNumber(text)
                                }}>
                                </TextInput>
                                <View>
                                    <View>
                                        <Button title='Verify Phone Number' onPress={() => {verifyPhone()}}></Button>
                                    </View>
                                </View>
                            </View>) 
                            : (
                            <View>
                                <Text style = { styles.loginTitle }>Enter Verification Code.</Text>
                                <TextInput 
                                style = {{ color: '#fff',
                                borderWidth: 1,
                                borderColor: '#ddd',
                                height: 40,
                                width: '100%',
                                marginTop: "2%",
                                marginBottom: '3%',
                                paddingLeft: '1%'}}
                                placeholderTextColor = "#ddd"
                                placeholder = "Phone Number"
                                inputMode='numeric'
                                value={verificationCode} 
                                onChangeText={(text) => {
                                    text = text.replace(/[^0-9]/g, '')
                                    setVerificationCode(text)
                                }}>
                                </TextInput>
                                <Button style={styles.registerButton} title='Send' onPress={() => {confirmCode()}}></Button>
                            </View>)}
                    </View>
                            )
                    :(<View>
                        <Text style={{color:'#aaa'}}>Phone Number</Text>
                        <Text style={{color:'white'}}>{currentUser.phoneNumber}</Text>
                    </View>)}
                </View>
            </View>
        )}
    </View>
    
    )
}

export default Profile;
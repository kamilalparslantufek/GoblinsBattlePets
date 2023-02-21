import 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { ActivityIndicator, Text, View, Button, TextInput } from 'react-native';
import styles from '../styles/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Profile = function Profile({navigation}){

    const [confirmation, setConfirmation] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [verificationCode, setVerificationCode] = useState();
    const [currentUser, setUser] = useState();
    const [isLoading, setLoading] = useState(true);
    const [error, setErrorState] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [phoneLinkState, setPhoneLinkState] = useState(false);
    const checkUserStatus = async () => {
        const user = auth().currentUser;
        setUser(user);
        if(user.phoneNumber != undefined){
            setPhoneLinkState(true)
        }
        setLoading(false)
    };
    
    //after creating the account link it with phone number
    async function ConfirmCode(){
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
                setLoading(false)
                setPhoneLinkState(true)
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
    async function VerifyPhone(){
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
            crashlytics().log('verification message could not be sent.')
            crashlytics().recordError(err);
            setErrorState(true);
            setErrorMessage(`${errorMessage} \n ${err}`)
            setLoading(false);
        }
    }
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
                <View>
                    <View style = {{marginBottom:'5%'}}>
                        <Text style={{color:'white', fontSize:20}}>User Profile</Text>
                        <View style={{flexDirection:'row', alignItems:'center',  paddingTop:'1%'}}>
                            <View style={{flex:1, height:1, backgroundColor:'#aaa'}}></View>
                            <View style={{flex:1, height:1, backgroundColor:'#aaa'}}></View>
                        </View>
                    </View>
                    <Text style={{color:'#aaa'}}>User</Text>
                    <Text style={{color:'white'}}>{currentUser.email}</Text>
                </View>
                <View>
                    {error ? (<Text style={{color:"white"}}>{errorMessage}</Text>) : (null)}
                </View>
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
                                        <Button title='Verify Phone Number' onPress={() => {VerifyPhone()}}></Button>
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
                                <Button style={styles.registerButton} title='Send' onPress={() => {ConfirmCode()}}></Button>
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
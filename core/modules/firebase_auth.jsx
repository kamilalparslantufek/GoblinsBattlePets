import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import {GOOGLE_SIGNIN_CLIENT_ID, FIREBASE_APP_CHECK_DEBUG_TOKEN} from '@env'
import { firebase } from '@react-native-firebase/app-check';


GoogleSignin.configure({
    webClientId: GOOGLE_SIGNIN_CLIENT_ID
  });

//email işlemleri
const loginWithEmailPassword = async (email, password) => {
    try{
        await auth().signInWithEmailAndPassword(email,password);
    }
    catch(err){
        throw new Error(err.message);
    }
}

const registerWithEmailPassword = async (email, password) => {
    try{
        await auth().createUserWithEmailAndPassword(email, password);
    }
    catch(err){
        throw new Error(err.message);
    }
}
//telefon numarası işlemleri
const authenticateWithPhone = async (phoneNumber) => {
    try
    {
        //app check için provider oluşturuyorum
        const rnfbProvider = firebase.appCheck().newReactNativeFirebaseAppCheckProvider();
        await rnfbProvider.configure({
            android:{
                provider: 'debug',
                debugToken: FIREBASE_APP_CHECK_DEBUG_TOKEN
            }});
        firebase.appCheck().initializeAppCheck({provider: rnfbProvider, isTokenAutoRefreshEnabled: true})
        //daha sonra telefon numarasına kod göndermek için bu satır çalışıyor ve confirmation stringi dönüyor.
        return await auth().signInWithPhoneNumber(`+${phoneNumber}`);
    }
    catch(err){
        throw new Error(err.message);
    }
}

const confirmPhoneCode = async(confirmCode, confirmation) => {
    try{
        return await confirmation.confirm(confirmCode)
    }
    catch(err){
        throw new Error(err.message);
    }
}

//google signin ile çalışan işlemler
const getSignInResult = async() => {
    try{
        await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true})
        return await GoogleSignin.signIn();
    }
    catch(err){

        throw new Error(err.message);
    }
}


const googleSigninRegister = async() => {
    try{
        const signInResult = await getSignInResult();
        const credentials = await auth.GoogleAuthProvider.credential(signInResult.idToken);
        return credentials;
    }
    catch(err){
        throw new Error(err.message);
    }
}

//just returns credentials
const googleSigninLogin = async() => {
    try{
        
        const signInResult = await getSignInResult();
        const credentials = await auth.GoogleAuthProvider.credential(signInResult.idToken);
        return credentials;
    }
    catch(err){
        throw new Error(err.message);
    }
}

//register sonrası hesap bağlamak için kullanılabilecek işlemler
const linkWithEmail = async(user, email) => {
    try{
        await user.updateEmail(email);
        // await user.sendEmailVerification({handleCodeInApp: false});
    }
    catch(err){
        throw new Error(err.message);
    }
}

const sendEmailVerification = async(user) => {
    try{
        //methodda bir sıkıntı var yarın düzelt
        await auth().currentUser.sendEmailVerification({handleCodeInApp: false});
    }    
    catch(err){
        throw new Error(err.message);
    }
}

export  {loginWithEmailPassword, registerWithEmailPassword, linkWithEmail,
        authenticateWithPhone, confirmPhoneCode,
        googleSigninRegister, googleSigninLogin};
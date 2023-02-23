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

const googleSigninLogin = async() => {
    try{
        const signInResult = await getSignInResult();
        const methods = await auth().fetchSignInMethodsForEmail(signInResult.user.email);
        if(methods.length > 0 && !methods.includes("google.com")) throw new Error("[auth/email-already-in-use] Email is already in use./ Try connecting accounts from profile page.");
        if(methods.length == 0) throw new Error("[auth/account-does-not-exist]");
        const credentials = await auth.GoogleAuthProvider.credential(signInResult.idToken);
        return credentials;
    }
    catch(err){
        throw new Error(err.message);
    }
}

const googleSignInRegister = async() =>{
    try{
        const signInResult = await getSignInResult();
        const methods = await auth().fetchSignInMethodsForEmail(signInResult.user.email);
        if(methods.length > 0) throw new Error("[auth/email-already-in-use]");
        const credentials = await auth.GoogleAuthProvider.credential(signInResult.idToken);
        return {credentials: credentials, result:signInResult};
    }
    catch(err){
        throw new Error(err.message);
    }
}
//register sonrası hesap bağlamak için kullanılabilecek işlemler
//sadece telefon numarası ile olan girişlerde email/şifre giriş yöntemi ekliyor.

const addEmailToAccount = async(user, email) => {
    try{
        await user.updateEmail(email);
        await auth().sendPasswordResetEmail(email);
        // await user.sendEmailVerification({handleCodeInApp: false});
    }
    catch(err){console.log(err.message)
        throw new Error(err.message);
    }
}

const sendEmailVerification = async(user) => {
    try{
        await user.sendEmailVerification();
    }    
    catch(err){
        console.log(err)
        throw new Error(err.message);
    }
}

const sendResetPassword = async(user) => {
    try{
        await auth().sendPasswordResetEmail(user.email);
    }
    catch(err){
        throw new Error(err.message);
    }
}

export  {loginWithEmailPassword, registerWithEmailPassword, addEmailToAccount, sendEmailVerification, sendResetPassword,
        authenticateWithPhone, confirmPhoneCode,
        googleSigninLogin, googleSignInRegister};
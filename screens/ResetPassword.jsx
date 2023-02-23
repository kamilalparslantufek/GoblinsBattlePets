import 'react-native-gesture-handler';
import { useState } from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import { ActivityIndicator, Text, View, Button, TextInput, Image, Alert } from 'react-native';
import styles from '../styles/styles';
import auth from '@react-native-firebase/auth';

const ResetPassword = function ResetPassword({navigation}){
    const [email,setEmail] = useState("");
    const sendResetEmail = async() => {
        console.log(3)
        try{
            await auth().sendPasswordResetEmail(email);
            Alert.alert('GoblinsBattlePets','Check your email!', [{
                title:'OK',
                onPress:() => {}
            }])
        }
        catch(err){
            crashlytics().log(err.message);
            crashlytics().recordError(err);
        }
    }

    return(
        <View style = {styles.container}>
            <Text style = {{fontSize:12, color:'#fff',marginVertical:'5%'}}>Reset your password.</Text>

            <Text style={{color:'#aaa'}}>Enter your email.</Text>
            <TextInput
            placeholder='Email'
            style = {styles.registerInput}
            value={email}
            onChangeText={(text) => {setEmail(text)}}></TextInput>

            <Button title='Reset Password'
            onPress={sendResetEmail()}>
            </Button>
        </View>    
    )
}

export default ResetPassword;
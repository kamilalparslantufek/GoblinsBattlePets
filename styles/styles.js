import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginContainer:{
      width: '100%',
      backgroundColor: '#121212',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop:'25%'
    },
    containerinfo:{
      flexDirection: 'row',
      backgroundColor: '#121212',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonGroup:{
        paddingTop: "15%",
        flexDirection: 'row',
        backgroundColor : '#121212',
         alignItems: 'center',
         justifyContent: 'center',
        flexWrap: 'wrap',

    },
    buttonGroupButton:{
        border: 0,
        padding: '1%',
        width: '40%'
    },
    registerButton:{
        border:0,
        width:'40%',
    },
    registerSubmit:{
        width:"100%",
    },
    registerForm:{
      width:"100%",
      alignItems: 'center',
      justifyContent: 'center'
    },
    registerFormButton:{
        paddingLeft:"20%",
        width:"30%"
    },
    input: {
      color: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      height: 40,
      width: '60%',
      marginBottom: '3%',
      paddingLeft: '1%'
    },
    registerInput:{
      color: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      height: 40,
      width: '100%',
      marginBottom: '3%',
      paddingLeft: '1%'
    },
    registerInput2:{
      color: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      height: 40,
      width: '80%',
      marginBottom: '3%',
      paddingLeft: '1%'
    },
    loginTitle: {
      padding: '3%',
      color: '#fff',
    }
  });

export default styles;
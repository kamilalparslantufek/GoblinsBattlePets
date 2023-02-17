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
        justifyContent: 'center'
    },
    buttonGroupButton:{
        border: 0,
    },
    registerButton:{
        paddingTop:"4%",
        border:0
    },
    registerSubmit:{
        width:"100%",
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
    loginTitle: {
      padding: '3%',
      color: '#fff',
    }
  });

export default styles;
import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
      alignItems: 'center',
      justifyContent: 'center',
    },
    listWrapper:{
      flex:1,
      backgroundColor: '#121212'
    },
    listContainer:{
      flex: 0.95,
      backgroundColor: '#121212',
      color:'#fff',
      paddingBottom:'5%'
    },
    listTitle:{
      color:'#fff', fontSize:20, paddingBottom:'1%'
    },
    listItem:{
      borderBottomWidth:  1,
      borderBottomColor: '#ccc'
    },
    listSingleItemGroup:{flexDirection:"row", alignItems:"center", justifyContent: "center", marginTop:`8%`, marginBottom:`8%`},
    loginContainer:{
      width: '100%',
      backgroundColor: '#121212',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop:'25%',
    },
    listSingleItemDetails:{flexDirection:"row", marginTop:`3%`, marginBottom:`8%`},
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
import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
      alignItems: 'center',
      justifyContent: 'center',
    },
    //main container - center focused
    newContainer: {
      flex: 1,
      alignItems:'center',
      alignContent:'center'
    },
    // light theme color scheme
    textDark: {
      color: '#212121',
    },
    textDarkMuted: {
      color: '#a0a0a0'
    },
    backgroundLight : {
      backgroundColor: '#e0efff',
    },
    cardBackgroundLight: {
     backgroundColor: '#fdfdfd', 
    },
    buttonLight: {
      backgroundColor: '#4d96ff',
    },
    textColor: {
      color: '#212121',
    },
    centerTextContainer: {
      width:'100%',
      textAlign:'center', 
      alignItems:'center',
      justifyContent:'center'
    },
    cardLarge: {
      backgroundColor:'#fdfdfd',
      marginTop: '5%', 
      padding:'5%', 
      width:'90%', 
      height: '80%', 
      borderRadius: 20
    },
    fontSize20:{
      fontSize: 20,
    },
    fontSize18:{
      fontSize: 18,
    },
    fontSize15:{
      fontSize: 15,
    },
    imageIcon:{
      width: 30,
      height: 30,
      marginRight: '5%'
    },
    buttonText:{
      textTransform:'uppercase',
      color:'#fdfdfd'
    },
    button:{
      padding:'5%', 
      alignItems:'center',
      justifyContent:'center',
      borderRadius: 3
    },
    homeButtonGroupContainer: {
      flexDirection:'row', 
      alignItems:'center', 
      justifyContent:'space-evenly',
      marginTop:'25%'
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
      color: '#fff',
    }
  });

export default styles;
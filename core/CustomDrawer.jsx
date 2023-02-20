import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import { createDrawerNavigator, DrawerItemList, DrawerItem, DrawerContentScrollView } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

function CustomNavigationContainer({screens, initialRoute})
{
 return(
   <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home"  useLegacyImplementation={true}>
                <Drawer.Screen name="Home" component = { Home } />
                <Drawer.Screen name="List" component = { List } />
                <Drawer.Screen name="Login" component = { Login } />
                <Drawer.Screen name="Register" component = { Register } />
                <Drawer.Screen name="Logout" component={ Logout } />
            </Drawer.Navigator> 
      </NavigationContainer>
   ) 
  
}

export default CustomNavigationContainer;
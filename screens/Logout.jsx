import 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { useDispatch } from 'react-redux';
import { setUserValue, setStatus} from '../core/redux/userSlice';
import {View, Text} from 'react-native'


export default function Logout({navigation}){
    const dispatch = useDispatch();
    dispatch(setUserValue(undefined));
    dispatch(setStatus("offline"));
    auth()
    .signOut()
    .then(() => {
      navigation.navigate("Home");
    })
    .catch((err) =>
    {
      crashlytics().log(err.message);
      crashlytics().recordError(err);
      navigation.navigate("Home");
    })
    return (<View>
      <Text>You are logging out.</Text>
    </View>)
  }
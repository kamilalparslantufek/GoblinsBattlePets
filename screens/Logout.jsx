import 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { useDispatch } from 'react-redux';
import { setUserValue, setStatus} from '../core/redux/userSlice';
import {View, Text} from 'react-native'
import {useEffect, useState, useFo} from 'react'
import { useIsFocused } from '@react-navigation/native';

export default function Logout({navigation})
{
  const [triggerLogout, setTriggerLogout] = useState(true);
  const dispatch = useDispatch();
  useEffect(() =>{
    auth()
    .signOut()
    .then(() => {
      dispatch(setUserValue(undefined));
      dispatch(setStatus("offline"));
      navigation.navigate("Home");
      console.log(1)
    })
    .catch((err) =>
    {
      console.log(err)
      crashlytics().log(err.message);
      crashlytics().recordError(err);
      navigation.navigate("Home");
    })

  }, [useIsFocused()]);

  return (<View>
    <Text>You are logging out.</Text>
  </View>)
}
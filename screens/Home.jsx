/* eslint-disable prettier/prettier */
import axios from 'axios';
import {BLIZZARD_API_KEY, BLIZZARD_API_SECRET} from '@env';
import crashlytics from '@react-native-firebase/crashlytics';
import {ActivityIndicator, Text, View, Button, Image} from 'react-native';
import {useEffect, useState, useRef} from 'react';
import auth from '@react-native-firebase/auth';
import styles from '../styles/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';



const Home = function Home({navigation}) {
  const [currentUser, setUser] = useState();
  const [singlePetData, setSinglePetData] = useState([]);
  const petListData = useRef([]);
  const [isLoading, setLoading] = useState(true);
  const apiAccessToken = useRef('');

  const checkUserStatus = async () => {
    const user = auth().currentUser;
    setUser(user);
  };

  const getSinglePetData = async () => {
    return axios
      .post(
        `https://oauth.battle.net/token?grant_type=client_credentials&client_id=${BLIZZARD_API_KEY}&client_secret=${BLIZZARD_API_SECRET}`,
      )
      .then(res => {
        apiAccessToken.current = res.data.access_token;
        axios
          .get(
            `https://eu.api.blizzard.com/data/wow/pet/index?namespace=static-eu&locale=en_GB&access_token=${res.data.access_token}`,
          )
          .then(res => {
            const list = res.data.pets;
            let item = list[Math.floor(Math.random() * list.length)];
            axios
              .get(
                `https://eu.api.blizzard.com/data/wow/pet/${item.id}?namespace=static-eu&locale=en_GB&access_token=${apiAccessToken.current}`,
              )
              .then(res => {
                const petData = {
                  id: res.data.id,
                  name: res.data.name,
                  description: res.data.description,
                  icon: res.data.icon,
                  creature_id: res.data.creature.id,
                };
                setSinglePetData(petData);
                axios
                  .get(
                    `https://eu.api.blizzard.com/data/wow/creature/${petData.creature_id}?namespace=static-eu&locale=en_GB&access_token=${apiAccessToken.current}`,
                  )
                  .then(res => {
                    const display_data = res.data.creature_displays[0];
                    axios
                      .get(
                        `https://eu.api.blizzard.com/data/wow/media/creature-display/${display_data.id}?namespace=static-eu&locale=en_GB&access_token=${apiAccessToken.current}`,
                      )
                      .then(res => {
                        const display_asset = res.data.assets[0];
                        setSinglePetData(prevState => ({
                          ...prevState,
                          displayImage: display_asset.value,
                        }));
                        setLoading(false);
                      })
                      .catch(err => {
                        crashlytics().log('Getting Single Pet Display Data.');
                        crashlytics().recordError(err);
                        setLoading(false);
                      });
                  })
                  .catch(err => {
                    crashlytics().log('Getting Single Pet Creature Data.');
                    crashlytics().recordError(err);
                    setLoading(false);
                  });
              })
              .catch(err => {
                crashlytics().log('Getting Single Pet Data.');
                crashlytics().recordError(err);
                setLoading(false);
              });
          })
          .catch(err => {
            crashlytics().log('Getting WoW Battle Pet List.');
            crashlytics().recordError(err);
            setLoading(false);
          });
      })
      .catch(err => {
        crashlytics().log('Getting Blizzard Access Token.');
        crashlytics().recordError(err);
        setSinglePetData(null);
      });
  };
  const getPetListData = async () => {
    return axios
      .post(
        `https://oauth.battle.net/token?grant_type=client_credentials&client_id=${BLIZZARD_API_KEY}&client_secret=${BLIZZARD_API_SECRET}`,
      )
      .then(res => {
        apiAccessToken.current = res.data.access_token;
        axios
          .get(
            `https://eu.api.blizzard.com/data/wow/pet/index?namespace=static-eu&locale=en_GB&access_token=${res.data.access_token}`,
          )
          .then(res => {
            const pets = res.data.pets
              .sort(() => 0.5 - Math.random())
              .slice(0, 50);
            petListData.current = pets;
            petListData.forEach(element => {
              console.log(element.name);
            });
          })
          .catch(err => {
            crashlytics().log(`error getting pet list`);
            crashlytics().recordError(err);
          });
      })
      .catch(err => {
        crashlytics.log(`error getting pet list`);
        crashlytics.recordError(err);
      });
  };

  function onAuthStateChanged(currentUser) {
    setUser(currentUser);
  }
  useEffect(() => {
    const sub = auth().onAuthStateChanged(onAuthStateChanged);
    return sub;
  });

  useEffect(() => {
    setLoading(true);
    checkUserStatus();
    getSinglePetData();
    getPetListData();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <View>
            <View style={styles.containerinfo}>
              {!isLoading ? (
                <Image
                  resizeMode="contain"
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  source={{uri: singlePetData.icon}}
                />
              ) : (
                <View></View>
              )}
              <Text style={styles.loginTitle}>{singlePetData.name}</Text>
            </View>
            <View>
              <Text style={styles.loginTitle}>{singlePetData.description}</Text>
              {!isLoading ? (
                <Image
                  resizeMode="center"
                  style={{
                    minHeight: 100,
                    minWidth: 100,
                    maxWidth: 600,
                    maxHeight: 600,
                    margin: '10%',
                  }}
                  source={{uri: singlePetData.displayImage}}
                />
              ) : (
                <View></View>
              )}
            </View>
          </View>
          {currentUser == undefined ? (
            <View style={{alignItems: 'center'}}>
              <Text style={{color: 'white'}}>
                Log in to learn about more pets.
              </Text>
              <View style={{width: '50%', margin: '4%',marginBottom:0, justifyContent:"center"}}>
                <Button
                  color="#D4AF37"
                  title="Login"
                  onPress={() =>{ navigation.navigate("Login")}}/>
              </View>
              <View style={{flexDirection:'row', alignItems:'center', width:'50%', paddingTop:'1%'}}>
                <View style={{flex:1, height:1, backgroundColor:'#aaa'}}></View>
                <View>
                  <Text style={{color:"#aaa", paddingLeft:'3%', paddingRight:'3%'}}>OR</Text>
                </View>
                <View style={{flex:1, height:1, backgroundColor:'#aaa'}}></View>
              </View>
                <TouchableOpacity
                  onPress={() => {navigation.navigate("Register")}}>
                  <Text style={{color:'#D4AF37'}}>Click here to create an account!</Text>
                </TouchableOpacity>
            </View>
          ) : (
            <View style={{alignItems: 'center'}}>
              <Text style={{color: 'white', margin:"1%"}}>Hello {currentUser.email}</Text>
              <View style={{width:"100%"}}>
                <TouchableOpacity style={{marginBottom:'1%'}} onPress={() => {navigation.navigate("List")}}>
                <View style={{borderWidth:2, borderColor:'#D4af37', paddingHorizontal:"5%", paddingVertical:"1%",borderRadius:9}}>
                  <Text style={{color:"#fff"}}>Click here to browse the list of pets avaible in the game.</Text>
                </View>
                </TouchableOpacity>
              </View>
              {currentUser.phoneNumber == undefined ? (
                <TouchableOpacity style={{width:'100%'}} onPress={() => {navigation.navigate("Profile")}}>
                <View style={{borderWidth:2, borderColor:'#D4af37', paddingHorizontal:"5%", paddingVertical:"1%",borderRadius:9, width:'100%'}}>
                  <Text style={{color:"#fff"}}>You can link your phone to your account here!</Text>
                </View>
                </TouchableOpacity>
              ) : (null)}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Home;

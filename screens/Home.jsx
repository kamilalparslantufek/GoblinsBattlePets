/* eslint-disable prettier/prettier */
import axios from 'axios';
import {BLIZZARD_API_KEY, BLIZZARD_API_SECRET} from '@env';
import crashlytics from '@react-native-firebase/crashlytics';
import {ActivityIndicator, Text, View, Button, Image} from 'react-native';
import {useEffect, useState, useRef} from 'react';
import styles from '../styles/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useSelector } from 'react-redux';
import { getUserStatus, getUserValue } from '../core/redux/userSlice';

const Home = function Home({navigation}) {
  //screen variables
  const currentUser = useSelector((state) => state.user.value);
  const [isLoading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState();
  const [errorStatus, setErrorStatus] = useState(false);
  //blizz api data
  const apiAccessToken = useRef('');
  const [singlePetData, setSinglePetData] = useState([]);

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

  useEffect(() => {
    setLoading(true);
    getSinglePetData();
    getPetListData();
  }, []);

  return(
    <View style={[styles.newContainer, styles.backgroundLight]}>
      {
        isLoading ? (<ActivityIndicator/>)
        :
        (
          //login kısmı
          <View style = {[styles.cardBackgroundLight, styles.cardLarge]}>
              {
              currentUser == undefined ? (
                <View style = {[styles.centerTextContainer]}>
                  <Text style = {[styles.textDark, styles.fontSize20]}>Goblin's Battle Pets</Text>
                  <Text style = {[styles.textDark]}>Learn about more battle pets, and their prices across the realms of World of Warcraft!</Text>   
                </View>
              )
              :(
                <View style = {styles.centerTextContainer}> 
                  <Text style = {[styles.textDark, styles.fontSize20]}>Goblin's Battle Pets</Text>
                  <Text style = {[styles.textDarkMuted]}>Hello {currentUser.email}!</Text>
                </View>
              )}
            {/* welcome image kısmı */}
            <View>
              {isLoading? (null) : (
                <View style = {{padding:'6%'}}>
                  <View style = {{flexDirection:'row', alignItems:'center'}}>
                    <Image
                    resizeMode='contain'
                    style={[styles.imageIcon]}
                    source={{uri: singlePetData.icon}}
                    />
                    <Text style = {[styles.textDark, styles.fontSize15]}>{singlePetData.name}</Text>
                  </View>
                  <Text style = {styles.textDarkMuted}>{singlePetData.description}</Text>
                </View>
                )
              }
            </View>
            {/* 3D model kısmı */}
            <>
              {isLoading? (null) : (
                <View style = {styles.centerTextContainer}>
                    <Text style= {[styles.textDark, styles.fontSize18]}>{singlePetData.name} 3D Model</Text>
                    <Image
                    resizeMode="contain"
                    style={{
                      minHeight: 100,
                      minWidth: 100,
                      maxWidth: 600,
                      width: '100%',
                      maxHeight: 600,
                      borderRadius: 5,
                      marginHorizontal: '6%'
                    }}
                    source={{uri: singlePetData.displayImage}}
                    />
                </View>
              )}
            </>
            {/* login buton kısmı */}
            <>
            {
              currentUser == undefined ? (
                <View style = {styles.homeButtonGroupContainer}>
                  <TouchableOpacity  onPress={() => navigation.navigate("Login")}>
                    <View style = {[styles.button, styles.buttonLight]}>
                      <Text style = {styles.buttonText}>Sign In</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <View style = {[styles.button, styles.buttonLight]}>
                      <Text style = {styles.buttonText}>Sign Up</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) 
              : (
                <View style = {styles.homeButtonGroupContainer}>
                  <TouchableOpacity  onPress={() => navigation.navigate("List")}>
                    <View style = {[styles.button, styles.buttonLight]}>
                      <Text style = {styles.buttonText}>Pet List</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <View style = {[styles.button, styles.buttonLight]}>
                      <Text style = {styles.buttonText}>Profile</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            }
            </>
          </View>
        )
      }
    </View>
  )


};

export default Home;

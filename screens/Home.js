import axios from "axios";
import { BLIZZARD_API_KEY, BLIZZARD_API_SECRET} from '@env';
import crashlytics from '@react-native-firebase/crashlytics'
import { ActivityIndicator, Text, View, Button, Image, StyleSheet } from 'react-native';
import { useEffect, useState, useRef } from 'react';

const Home = function Home({ navigation }){

    const [homePagePetData, setHomePagePetData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const apiAccessToken = useRef("");
    
    const getDataAxios = async () => {
    return axios.post(`https://oauth.battle.net/token?grant_type=client_credentials&client_id=${BLIZZARD_API_KEY}&client_secret=${BLIZZARD_API_SECRET}`)
        .then((res) => {
            apiAccessToken.current = res.data.access_token;
            axios.get(`https://eu.api.blizzard.com/data/wow/pet/index?namespace=static-eu&locale=en_GB&access_token=${res.data.access_token}`)
                .then((res) => {
                    const list = res.data.pets;
                    let item = list[Math.floor(Math.random()*list.length)]
                axios.get(`https://eu.api.blizzard.com/data/wow/pet/${item.id}?namespace=static-eu&locale=en_GB&access_token=${apiAccessToken.current}`)
                    .then((res => {
                        const petData = {
                            "id" : res.data.id,
                            "name" : res.data.name,
                            "description" : res.data.description,
                            "icon" : res.data.icon,
                            "creature_id" : res.data.creature.id
                        }
                        setHomePagePetData(petData);
                    axios.get(`https://eu.api.blizzard.com/data/wow/creature/${petData.creature_id}?namespace=static-eu&locale=en_GB&access_token=${apiAccessToken.current}`)
                        .then((res) => {
                            const display_data = res.data.creature_displays[0]
                            axios.get(`https://eu.api.blizzard.com/data/wow/media/creature-display/${display_data.id}?namespace=static-eu&locale=en_GB&access_token=${apiAccessToken.current}`)
                                .then((res) => {
                                const display_asset = res.data.assets[0]
                                setHomePagePetData(prevState => ({
                                    ...prevState,
                                    displayImage: display_asset.value
                                }))
                                setLoading(false);
                        })
                        .catch((err) => {
                            crashlytics().log('Getting Single Pet Display Data.')
                            crashlytics().recordError(err);
                            setLoading(false);
                        })
                    })
                    .catch((err) => {
                        crashlytics().log('Getting Single Pet Creature Data.')
                        crashlytics().recordError(err);
                        setLoading(false);
                    })
                }))
                .catch((err) => {
                    crashlytics().log('Getting Single Pet Data.')
                    crashlytics().recordError(err);
                    setLoading(false);
                })
            })
            .catch((err) => {
                crashlytics().log('Getting WoW Battle Pet List.')
                crashlytics().recordError(err);
                setLoading(false);
            })
        })
        .catch((err) => {
                crashlytics().log('Getting Blizzard Access Token.')
                crashlytics().recordError(err);
                setHomePagePetData(null);
        });
    }


    useEffect(() => {
      setLoading(true);
      getDataAxios();
    }, []);
    
    return (
      <View style={styles.container}>
        {isLoading ? (<ActivityIndicator/>) : (
          <View>
            <View>
              <View style = {styles.containerinfo}>
                {
                  !isLoading ? 
                  <Image
                  resizeMode='contain'
                  style = {{
                    width: 30,
                    height: 30,
                  }}
                  source={{uri: homePagePetData.icon}}
                  /> : <View></View>
                }
                <Text style={styles.loginTitle}>{homePagePetData.name}</Text>
              </View>
              <View>
                <Text style={styles.loginTitle}>{homePagePetData.description}</Text>
                {
                  !isLoading ? <Image 
                  resizeMode='center'
                  style = {{
                    minHeight: 100,
                    minWidth: 100,
                    maxWidth: 600,
                    maxHeight: 600,
                    margin: '10%'
                  }}
                  source={{uri: homePagePetData.displayImage}}/> : <View></View>
                }
              </View>
            </View>
            <View style= {{alignItems: 'center'}}>
              <Text style= {{color:'white'}}>Log in to learn about more pets.</Text>
              <View style={{width: '80%'}}>
                <Button color='#D4AF37' title='Login' onPress={ () => navigation.navigate('Login')}></Button>
              </View>
            </View>
          </View>
        ) }
      </View>
    )
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#181818',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginContainer:{
      flex: 0.5,
      backgroundColor: '#777',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop:'25%'
    },
    containerinfo:{
      flexDirection: 'row',
      backgroundColor: '#181818',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonGroup:{
        flex: 0.5,
        paddingBottom: 100,
        flexDirection: 'row',
        backgroundColor : '#777',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonGroupButton:{
        border: 0,
        shadowOffset: 0,
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


export default Home;
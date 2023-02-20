import axios from "axios";
import { BLIZZARD_API_KEY, BLIZZARD_API_SECRET} from '@env';
import crashlytics from '@react-native-firebase/crashlytics'
import { ActivityIndicator, Text, View, Button, Image,TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import auth from '@react-native-firebase/auth'
import styles from '../styles/styles';
import { FlatList } from "react-native-gesture-handler";

const List = function List({ navigation }){
    
    const [currentUser, setUser] = useState();
    const [singlePetScreenToggled, setSinglePetScreenToggle] = useState(false);
    const [singlePetData, setSinglePetData] = useState([]);
    const singlePetAuctions = useRef([]);
    const petListData = useRef([]);
    const [isLoading, setLoading] = useState(true);
    const apiAccessToken = useRef("");
   
    const checkUserStatus = async () => {
      const currentUser = auth().currentUser;
      setUser(currentUser);
    }
    function getSinglePetData(id)
    {
        setLoading(true)
        axios.post(`https://oauth.battle.net/token?grant_type=client_credentials&client_id=${BLIZZARD_API_KEY}&client_secret=${BLIZZARD_API_SECRET}`)
            .then((res) => {
                apiAccessToken.current = res.data.access_token;
                axios.get(`https://eu.api.blizzard.com/data/wow/pet/${id}?namespace=static-eu&locale=en_GB&access_token=${res.data.access_token}`)
                    .then((res) => {
                        const petData = {
                            "id" : res.data.id,
                            "name" : res.data.name,
                            "description" : res.data.description,
                            "icon" : res.data.icon,
                            "creature_id" : res.data.creature.id
                        }
                        setSinglePetData(petData)
                        axios.get(`https://eu.api.blizzard.com/data/wow/creature/${petData.creature_id}?namespace=static-eu&locale=en_GB&access_token=${apiAccessToken.current}`)
                            .then((res) => {
                                const display_data = res.data.creature_displays[0]
                                axios.get(`https://eu.api.blizzard.com/data/wow/media/creature-display/${display_data.id}?namespace=static-eu&locale=en_GB&access_token=${apiAccessToken.current}`)
                                    .then((res) => {
                                        const display_asset = res.data.assets[0]
                                        setSinglePetData(prevState => ({
                                            ...prevState,
                                            displayImage: display_asset.value
                                        }))
                                        axios.get(`https://eu.api.blizzard.com/data/wow/connected-realm/3674/auctions?namespace=dynamic-eu&locale=en_GB&access_token=${apiAccessToken.current}`,
                                        {
                                            maxContentLength: Infinity,
                                            maxBodyLength: Infinity
                                        })
                                            .then((res) =>{
                                                const filter = res.data.auctions.filter((auction) =>{
                                                    if(auction.item.id == 82800 &&  auction.item.pet_species_id == id)
                                                        return auction
                                                })
                                                // setSinglePetData(prevState => ({
                                                //     ...prevState,
                                                //     auctions: filter
                                                // }))
                                                singlePetAuctions.current = filter
                                                // console.log(filter)
                                                console.log(singlePetData)
                                                console.log(singlePetAuctions)
                                                setLoading(false)
                                                setSinglePetScreenToggle(true)
                                            })
                                            .catch((err) => {
                                                //realm auction data
                                                console.log(err)
                                                console.log(`realm auction`)
                                                crashlytics().log(`realm auction`)
                                                crashlytics().recordError(err)
                                            })
                                    })
                                    .catch((err) => {
                                        //pet creature display data
                                        console.log(`creature display`)
                                        crashlytics().log(`creature display`)
                                        crashlytics().recordError(err)
                                    })
                            })
                            .catch((err) => {
                                //pet creature data
                                console.log(`pet creature`)
                                crashlytics().log(`pet creature`)
                                crashlytics().recordError(err)
                            })
                    })
                    .catch((err) => {
                        //single pet data
                        crashlytics().log(`single pet data`)
                        crashlytics().recordError(err)
                    })

            })
            .catch((err) => {
                //auth
                console.log(`auth`)
                crashlytics().log(`auth`)
                crashlytics().recordError(err)
            })

    }

    const getPetListData = async () => {
        return axios.post(`https://oauth.battle.net/token?grant_type=client_credentials&client_id=${BLIZZARD_API_KEY}&client_secret=${BLIZZARD_API_SECRET}`)
          .then((res) => {
              apiAccessToken.current = res.data.access_token;
              axios.get(`https://eu.api.blizzard.com/data/wow/pet/index?namespace=static-eu&locale=en_GB&access_token=${res.data.access_token}`)
                .then((res) => {
                    const pets = res.data.pets.sort(() =>   0.5 - Math.random()).slice(0,50);
                    petListData.current =  pets;
                    setLoading(false)
                })
                .catch((err) => {
                  crashlytics().log(`error getting pet list`);
                  crashlytics().recordError(err);
                  setLoading(false)
                })
          })
          .catch((err) => {
            crashlytics.log(`error getting pet list`);
            crashlytics.recordError(err);
            setLoading(false)
          })
    }

    function onAuthStateChanged(currentUser){
      setUser(currentUser);
    }
    useEffect(() => {
      const sub = auth().onAuthStateChanged(onAuthStateChanged);  
      return sub;
    })

    useEffect(() => {
      setLoading(true);
      checkUserStatus();
      getPetListData();
    }, []);
    const renderItem = ({item}) => {
        return(
            <Item
            item={item}
            onPress={() => {getSinglePetData(item.id)}}
            backgroundColor = {'#121212'}
            textColor = {'#fff'} />
        )
    }
    const renderBuyoutItem = ({item}) =>{
        return(
            <BuyoutItem
            item={item}
            />
        )
    }
    return (
      <View style={styles.listWrapper}>
        {isLoading ? (<ActivityIndicator/>) : (
            <View style ={styles.listContainer}> 
                {!singlePetScreenToggled ? (
                    <View key='list'>
                        <Text style={styles.listTitle}>List Of Pets</Text>
                        <FlatList
                        data={petListData.current}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        />
                    </View>)
                :(
                    <View style={{flex:1}}>
                        <View style={styles.listSingleItemGroup}>
                            <Image
                            resizeMode='contain'
                            style = {{
                            width: 30,
                            height: 30,
                            }}
                            source={{uri: singlePetData.icon}}
                            />
                            <Text style={[styles.listTitle,{paddingLeft:`1%`}]}>{singlePetData.name}</Text>
                        </View>
                        <View style={[styles.listSingleItemDetails]}>
                            <View style={{marginLeft:`5%`}}>
                                <Text style={styles.listTitle}>3D In-game Model</Text>
                                <Image 
                                resizeMode='center'
                                style = {{
                                    minHeight: 100,
                                    minWidth: 100,
                                    maxWidth: 600,
                                    maxHeight: 600,
                                    margin: '10%'
                                }}
                                source={{uri: singlePetData.displayImage}}/>
                            </View>
                            <View style={{width:`50%`}}>
                                <Text style={styles.listTitle}>Description</Text>
                                <Text style={styles.loginTitle}>
                                    {singlePetData.description}
                                </Text>
                            </View>
                        </View>
                        <View style={{marginLeft:'5%', marginRight:'5%', height:"35%"}}>
                            <Text style={[styles.listTitle]}>Prices on Twisting Nether</Text>
                            {singlePetAuctions.current.length == 0 ? (<Text>There Are no Auctions For This Pet.</Text>) :(
                                <FlatList
                                data={singlePetAuctions.current}
                                renderItem={({item}) => {return(
                                    <View style={{justifyContent:"space-between", flexDirection:"row"}}>
                                        <View>
                                            <Text style={{color:"#fff", margin:"1%"}}>Quantity: {item.quantity}</Text>
                                        </View>
                                        <View style={{flexDirection:"row"}}>
                                            <Text style={{color:"#fff", margin:"1%"}}>{item.buyout/10000}</Text>
                                            <Image
                                            resizeMode="center"
                                            style={{
                                                width:16,
                                                height:16
                                            }}
                                            source={{uri:`https://www.meme-arsenal.com/memes/8f9115ca845caf28031cfca81c861ed2.jpg`}}
                                            />
                                        </View>
                                    </View>
                                )}}/>

                            )}
                        </View>
                        <View style={[{width: `90%`, alignItems:`flex-end`, justifyContent:`flex-end`, bottom:0, position:"absolute"}]}>
                            <Button title='Go Back' onPress={() =>setSinglePetScreenToggle(false)}></Button>
                        </View>
                    </View>
                )}
                
            </View>
        ) }
      </View>
    )
  }

const Item = ({item, onPress, backgroundColor, textColor}) => (
    <TouchableOpacity onPress={onPress} style={[styles.listItem, {backgroundColor}]}>
        <Text style={[styles.title, {color: textColor, margin:'1%'}]}>{item.name}</Text>
  </TouchableOpacity>
  );

export default List;
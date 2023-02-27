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
                  sou4rce={{uri: singlePetData.displayImage}}
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
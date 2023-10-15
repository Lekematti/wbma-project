import React, {useContext, useEffect, useState} from 'react';
import {FlatList, ImageBackground, SafeAreaView} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';
import {useFavourite} from '../hooks/ApiHooks';
import {Text} from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListItem from "../components/ListItem";
import {MainContext} from "../contexts/MainContext";

const Favorites = ({navigation}) => {
  const {update} = useContext(MainContext)
  const {getFavouritesByToken} = useFavourite();
  const [favouritePosts, setFavouritePosts] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false);
  const back_IMAGE = require('../assets/beerPhoto2.png')

  const fetchUserLikes = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const likesData = await getFavouritesByToken(token);
      setFavouritePosts(likesData);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchUserLikes();
  }, [update]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    console.log('Refreshing...');

    // Fetch or update your data here
    fetchUserLikes()
      .then(() => setIsRefreshing(false))
      .catch((error) => {
        console.error(error.message);
        setIsRefreshing(false);
      });
  };

  return (

    <ImageBackground
      source={back_IMAGE}
      style={{
        height: 'auto',
        width: 'auto',
        resizeMode: "cover",
        overflow: "hidden",
        flex: 1
      }}>
      <SafeAreaView>

        {favouritePosts.length > 0 ? (
          <FlatList style={{marginTop: 50}}
                    onRefresh={
                      handleRefresh
                    }
                    refreshing={isRefreshing}
                    data={favouritePosts}
                    keyExtractor={(item) => item.file_id.toString()}
                    renderItem={({item}) => (
                      <ListItem navigation={navigation} singleMedia={item}/>
                    )}
          />
        ) : (
          <Text>No liked posts found.</Text>
        )}

      </SafeAreaView>
      <StatusBar style="auto"/>
    </ImageBackground>

  );
};
Favorites.propTypes = {
  navigation: PropTypes.object,
};

export default Favorites;

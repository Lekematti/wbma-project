import React, {useContext, useEffect, useState} from 'react';
import {FlatList, SafeAreaView} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';
import {useFavourite} from '../hooks/ApiHooks';
import {Text} from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListItem from "../components/ListItem";
import {MainContext} from "../contexts/MainContext";
import { RefreshControl } from 'react-native';

const Favorites = ({navigation}) => {
  const {update} = useContext(MainContext)
  const {getFavouritesByToken} = useFavourite();
  const [favouritePosts, setFavouritePosts] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false);

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

    // Fetch or update your data here
    fetchUserLikes()
      .then(() => setIsRefreshing(false))
      .catch((error) => {
        console.error(error.message);
        setIsRefreshing(false);
      });
  };

  return (
    <>
      <SafeAreaView>
          {favouritePosts.length > 0 ? (
            <FlatList
              data={favouritePosts}
              keyExtractor={(item) => item.file_id.toString()}
              renderItem={({ item }) => (
                <ListItem navigation={navigation} singleMedia={item} />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                />
              }
            />
          ) : (
            <Text>No liked posts found.</Text>
          )}
      </SafeAreaView>
      <StatusBar style="auto" />
    </>
  );
};
Favorites.propTypes = {
  navigation: PropTypes.object,
};

export default Favorites;

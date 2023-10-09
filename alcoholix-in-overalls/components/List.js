import {FlatList} from 'react-native';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import React, {useContext, useState} from "react";
import {MainContext} from "../contexts/MainContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const List = ({navigation, mediaArray,}) => {

  const [isRefreshing, setIsRefreshing] = useState(false);
  const {update, setUpdate} = useContext(MainContext)


  const handleRefresh = async () => {
    console.log('Refreshing...'); // Add this line
    setIsRefreshing(true);

    try {
      setUpdate(!update)

      setIsRefreshing(false);
      console.log('Refresh completed.'); // Add this line
    } catch (error) {
      console.error('Error while refreshing:', error);
      setIsRefreshing(false);
    }
  };


  return (
    <FlatList
      onRefresh={
        handleRefresh
      }
      refreshing={isRefreshing}
      data={mediaArray}
      style={{marginBottom: 50}}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item}/>
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
};

export default List;

import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, View,} from 'react-native';
import {Text,} from '@rneui/themed';
import List from '../components/List';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';
import {useMedia} from "../hooks/ApiHooks";
import SearchBar from "../utils/search";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Home = ({navigation}) => {

  const {loadMedia, searchMedia, mediaArray} = useMedia(); // Use the useSearch hook
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [searchResults, setSearchResults] = useState([]); // State to store search results


  // Function to handle search
  const makeSearch = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const searchData = await searchMedia({ title: searchTerm}, token);
      //console.log('Search Results:', searchData); // Debugging
      setSearchResults(searchData);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    //console.log('Search Term:', searchTerm);
    if (searchTerm.trim() !== '') {
      // If search term is not empty, perform search
      makeSearch();
    } else {
      // If search term is empty, load all posts with the specific appId
      loadMedia();
    }
  }, [searchTerm]);

  useEffect(() => {
    // Load all posts with the specific appId initially
    loadMedia();
  }, []);

  return (
    <>
      <SafeAreaView>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.file_id.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>Title: {item.title}</Text>
              <Text>Description: {item.description}</Text>
            </View>
          )}
        />
        <List navigation={navigation} mediaArray={mediaArray} />
      </SafeAreaView>
      <StatusBar style="auto" />
    </>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};


export default Home;

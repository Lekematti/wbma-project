import React, {useEffect, useState} from 'react';
import {SafeAreaView,} from 'react-native';
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
      const mySearch = searchData.filter();
      setSearchResults(mySearch);
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
        {mediaArray.length > 0 ? (
          <List navigation={navigation} mediaArray={mediaArray} />
        ) : (
          <Text>No posts found.</Text>
        )}

      </SafeAreaView>
      <StatusBar style="auto" />
    </>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};


export default Home;

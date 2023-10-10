import React, {useEffect, useState} from 'react';
import {ImageBackground, SafeAreaView, View,} from 'react-native';
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
  // const [searchQuery, setSearchQuery] = useState('');
  // const [showList, setShowList] = useState(true);
  const back_IMAGE = require('../assets/beerPhoto2.png')

  // const makeSearch = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('userToken');
  //     const searchData = await searchMedia({ title: searchTerm}, token);
  //     //console.log('Search Results:', searchData); // Debugging
  //     const mySearch = await Promise.all(
  //       searchData.filter(async (item) => {
  //         return await doFetch(apiUrl + 'media/' + item.file_id);
  //       }),
  //     );
  //     setSearchResults(mySearch);
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  // Function to handle search
  const makeSearch = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const searchData = await searchMedia({title: searchTerm}, token);
      //console.log('Search Results:', searchData); // Debugging
      const mySearch = searchData.filter(mediaArray);

      setSearchResults(mySearch);
    } catch (error) {
      console.error(error.message);
    }
  };

  // useEffect(() => {
  //   if (searchQuery !== '') {
  //     const results = mediaArray.filter(
  //       (media) =>
  //         media.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         media.description.toLowerCase().includes(searchQuery.toLowerCase()),
  //     );
  //     setSearchResults(results);
  //     setShowList(false); // Hide the list when search is active
  //   } else {
  //     setShowList(true); // Show the list when no search is performed
  //   }
  // }, [searchQuery, mediaArray]);

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
          <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 10, padding: 5, marginLeft: 10 }}>
            <Text>{mediaArray.length} posts</Text>
          </View>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          {mediaArray.length > 0 ? (
            <List navigation={navigation} mediaArray={mediaArray}/>
          ) : (
            <Text>No posts found.</Text>
          )}
        </SafeAreaView>
        <StatusBar style="auto"/>
      </ImageBackground>

    </>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};


export default Home;

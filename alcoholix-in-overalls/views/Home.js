import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, View,} from 'react-native';
import {Text,} from '@rneui/themed';
import List from '../components/List';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';
import {useSearch} from "../hooks/ApiHooks";
import SearchBar from "../utils/search";
import AsyncStorage from "@react-native-async-storage/async-storage";




const Home = ({navigation}) => {

  const { searchMedia } = useSearch(); // Use the useSearch hook
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [searchResults, setSearchResults] = useState([]); // State to store search results


  // Function to handle search
  const makeSearch = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const searchData = await searchMedia({ searchQuery: searchTerm}, token);
      console.log('Search Results:', searchData); // Debugging
      setSearchResults(searchData);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    console.log('Search Term:', searchTerm); // Debugging
    // Fetch search results when searchTerm changes
    makeSearch();
  }, [searchTerm]);



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
        <List navigation={navigation} />
      </SafeAreaView>
      <StatusBar style="auto" />
    </>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;

import React, {useEffect, useState} from 'react';
import {ImageBackground, SafeAreaView, ScrollView, TextInput, View,} from 'react-native';
import {Card, Icon,} from '@rneui/themed';
import List from '../components/List';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';
import {useMedia} from "../hooks/ApiHooks";

import ListItem from "../components/ListItem";


const Home = ({navigation}) => {
    const {loadMedia, mediaArray} = useMedia(); // Use the useSearch hook
    const [searchResults, setSearchResults] = useState([]); // State to store search results
    const [searchQuery, setSearchQuery] = useState('');
    const [showList, setShowList] = useState(true);
    const back_IMAGE = require('../assets/beerPhoto2.png')

    useEffect(() => {
        if (searchQuery !== '') {
            const results = mediaArray.filter((media) => media.title.toLowerCase().includes(searchQuery.toLowerCase()) || media.description.toLowerCase().includes(searchQuery.toLowerCase()),);
            setSearchResults(results);
            setShowList(false); // Hide the list when search is active
        } else {
            setShowList(true); // Show the list when no search is performed
        }
    }, [searchQuery, mediaArray]);


    useEffect(() => {
        // Load all posts with the specific appId initially
        loadMedia();
    }, []);


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
            <SafeAreaView style={{flex: 1, marginBottom: 0}}>
                <Card containerStyle={{
                    backgroundColor: '#000000',
                    borderWidth: 1,
                    borderColor: '#ffec00',
                    borderRadius: 5,
                    padding: 5,
                    marginTop: 50,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Icon
                            name="search"
                            color="#ffec00"
                        />
                        <TextInput
                            style={{
                                color: '#ffec00',
                                padding: 5,
                                marginLeft: 5,
                            }}
                            placeholder="Search                                                                           "
                            placeholderTextColor="#ffec00"
                            onChangeText={setSearchQuery}
                            value={searchQuery}
                        />
                    </View>
                </Card>
                {showList ? (
                    <List navigation={navigation} mediaArray={mediaArray}/>
                ) : (
                    <ScrollView>
                        {searchResults.map((item) => (
                            <ListItem navigation={navigation} singleMedia={item}/>
                        ))}
                    </ScrollView>
                )}
            </SafeAreaView>
            <StatusBar style="auto"/>
        </ImageBackground>
    );
};


Home.propTypes = {navigation: PropTypes.object,};

export default Home;

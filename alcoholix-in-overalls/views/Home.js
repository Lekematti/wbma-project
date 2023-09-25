import React from 'react';
import {SafeAreaView} from 'react-native';
import List from '../components/List';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';

const Home = ({navigation}) => {
  return (
    <>
      <SafeAreaView>
        <List navigation = {navigation}/>
      </SafeAreaView>
      <StatusBar style="auto"/>
    </>
  );
};

Home.prototype = {
  navigation: PropTypes.object,
};


export default Home;

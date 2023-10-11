import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/app-config';
import { Card, Icon, ListItem, Text} from '@rneui/themed';
import ProfileForm from '../components/ProfileForm';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";


const Profile = (props) => {
  const [avatar, setAvatar] = useState('https://users.metropolia.fi/~leokos/%20Web-pohjaiset-mobiilisovellukset/project/pics/beerPhoto2.png');
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user} = useContext(MainContext);
  const logOut = async () => {
    console.log('profile, logout');
    try {
      await AsyncStorage.clear();
      setIsLoggedIn(false);
    } catch (error) {
      console.error(error);
    }
  };
  const loadAvatar = async () => {
    try {
      const avatars = await getFilesByTag('avatar_' + user.user_id);
      if (avatars.length > 0) {
        setAvatar(mediaUrl + avatars.pop().filename);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadAvatar();
  }, []);

  return (
    <ScrollView style={{backgroundColor: '#000000'}}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.text}>{user.username}</Card.Title>
        <Card.Image style={styles.image} source={{uri: avatar}} />
        <ListItem containerStyle={styles.listItem}>
          <Icon name="email" color='#ffe800'/>
          <ListItem.Title style={styles.text}>{user.email}</ListItem.Title>
        </ListItem>
        {user.full_name && (
          <ListItem containerStyle={styles.listItem}>
            <Icon name="person" color='#ffe800'/>
            <ListItem.Title style={styles.text}>{user.full_name}</ListItem.Title>
          </ListItem>
        )}
        <ListItem containerStyle={styles.listItem}>
          <Icon name='fingerprint' color='#ffe800'/>
          <ListItem.Title style={styles.text}>user id: {user.user_id}</ListItem.Title>
        </ListItem>
        <Card.Divider />

          <TouchableOpacity
              onPress={logOut}>
            <LinearGradient
                style={styles.linearGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                colors={['#d5af24', '#c09c24', '#ffea00', '#ff9900', '#F77737']}>
              <Text style={styles.buttonText}>Log out!</Text>
              <Icon name="logout" color='#000000' />
            </LinearGradient>
          </TouchableOpacity>

        <TouchableOpacity
            onPress={loadAvatar}>
          <LinearGradient
              style={styles.linearGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#d5af24', '#c09c24', '#ffea00', '#ff9900', '#F77737']}>
            <Text style={styles.buttonText}>Load avatar</Text>
            <Icon name="upgrade" color='#000000' />
          </LinearGradient>
        </TouchableOpacity>

        <ProfileForm />

      </Card>
    </ScrollView>

  );
};

const styles= StyleSheet.create({
  image: {
    borderColor: '#ffee00',
    borderWidth: 1,
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  container: {
    backgroundColor: '#000000',
  },
  card: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 10
  },
  listItem: {
    backgroundColor: '#000000',
  },
  text: {
    textAlign: "center",
    color: '#ffe800',
  },
  linearGradient: {
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,

  },
    buttonText:{
        textAlign: "center",
        color: '#000000',
    }
});


export default Profile;

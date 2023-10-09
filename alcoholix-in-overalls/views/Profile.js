import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/app-config';
import {Button, Card, Icon, ListItem} from '@rneui/themed';
import ProfileForm from '../components/ProfileForm';
import {ScrollView, StyleSheet} from 'react-native';


const Profile = (props) => {
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
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
    <ScrollView style={{backgroundColor: '#ffeb00'}}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.text}>{user.username}</Card.Title>
        <Card.Image source={{uri: avatar}} />
        <ListItem>
          <Icon name="email" />
          <ListItem.Title style={styles.text}>{user.email}</ListItem.Title>
        </ListItem>
        {user.full_name && (
          <ListItem>
            <Icon name="person" />
            <ListItem.Title style={styles.text}>{user.full_name}</ListItem.Title>
          </ListItem>
        )}
        <ListItem>
          <ListItem.Title style={styles.text}>user id: {user.user_id}</ListItem.Title>
        </ListItem>
        <Card.Divider />
        <ListItem>
          <Button title="Log out!" onPress={logOut}>
          Log out!
          <Icon name="logout" color="white" />
        </Button>
        </ListItem>
       <ListItem>
         <Button title="Load avatar" onPress={loadAvatar}>
           Load avatar
           <Icon name="loadavatar" color="white" />
         </Button>
       </ListItem>
        <ProfileForm />

      </Card>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  image: {
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
    color: '#dbcd34',
  },
  button: {
    color: '#008c8c',
    textColor: '#dbcd34',
  },
});


export default Profile;

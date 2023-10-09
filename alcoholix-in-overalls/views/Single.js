import React, {useContext, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/app-config';
import {formatDate} from '../utils/functions';
import {Card, Icon, Text, ListItem, Button} from '@rneui/themed';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useRating, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ScrollView} from 'react-native';
import { AirbnbRating } from "react-native-elements";

const Single = ({route, navigation}) => {

  const [owner, setOwner] = useState({});
  const [userLike, setUserLike] = useState(false);
  const [userRating, setUserRating] = useState(false)
  const {user, update, setUpdate} = useContext(MainContext);
  const {getUserById} = useUser();
  const {postFavourite, getFavouritesById, deleteFavourite} = useFavourite();
  const {postRating, getRatingsById, deleteRating} = useRating();
  const [likes, setLikes] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [myRating, setMyRating] = useState(null);
  const videoRef = useRef(null);
  const WATER_IMAGE = require('../assets/-beer_89775.png')
  const {
    title,
    description,
    filename,
    time_added: timeAdded,
    user_id: userId,
    filesize,
    media_type: mediaType,
    file_id: fileId,
  } = route.params;

  // fetch owner info
  const fetchOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const ownerData = await getUserById(userId, token);
      setOwner(ownerData);
    } catch (error) {
      console.error(error.message);
    }
  };

  // fullscreen video on landscape
  const unlockOrientation = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error(error.message);
    }
  };

  const lockOrientation = async () => {
    try {
      await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const showVideoInFullscreen = async () => {
    try {
      await videoRef.current.presentFullscreenPlayer();
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    unlockOrientation();
    fetchOwner();

    // fullscreen video on landscape
    const orientSub = ScreenOrientation.addOrientationChangeListener(
        (event) => {
          if (event.orientationInfo.orientation > 2) {
            videoRef.current && showVideoInFullscreen();
          }
        },
    );

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lockOrientation();
    };
  }, []);


  // add favourite
  const createFavourite = async () => {

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postFavourite({file_id: fileId}, token);
      response && setUserLike(true);
      setUpdate(!update)
      console.log(response)
    } catch (error) {
      console.error(error.message);
    }
  };

  // delete favourite
  const removeFavourite = async () => {
    console.log('postaa like')
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await deleteFavourite(fileId, token);
      response && setUserLike(false);
      console.log(response, setUserRating)

    } catch (error) {
      console.error(error.message);
    }
    console.log('-------------------------')
  };

  // get favouritesbyid
  const fetchLikes = async () => {
    try {
      const likesData = await getFavouritesById(fileId);
      setLikes(likesData);
      // check if userid stored in context is in likesData
      likesData.forEach((like) => {
        if (like.user_id === user.user_id) {
          setUserLike(true);
        }
        //console.log(likesData)
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [userLike]);

  // add rating
  const createRating = async (number) => {
    console.log('tekee rating', number)
    try {
      await removeRating()
      const token = await AsyncStorage.getItem('userToken');
      const response = await postRating({file_id: fileId, rating: number}, token);
      if (response) {
        setUserRating(true);
        setMyRating(number);
      }
    } catch (error) {
      console.error(error.message);
    }
    console.log('-------------------------')
  };



  // get ratingsbyid
  const fetchRatings = async () => {
    console.log('hakee rating')
    try {
      const ratingsData = await getRatingsById(fileId);
      setRatings(ratingsData);
      calculateAverageRating();
      console.log(ratingsData)
      // check if userid stored in context is in ratingsData
      ratingsData.forEach((rating) => {
        if (rating.user_id === user.user_id) {
          setUserRating(true);
        }
      });
    } catch (error) {
      console.error(error.message);
    }
    console.log('-------------------------')
  };

  const removeRating = async () => {
    console.log('postaa rating')
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await deleteRating(fileId, token);
      response && setUserRating(false);
    } catch (error) {
      //console.error(error.message);
    }
    console.log('-------------------------')
  };

  useEffect(() => {
    fetchRatings();

  }, [userRating]);

  useEffect(() => {
    calculateAverageRating();
    // Set the user's rating when ratings data is loaded
    if (ratings.length > 0) {
      const userRating = ratings.find((rating) => rating.user_id === user.user_id);
      if (userRating) {
        setMyRating(userRating.rating);
      } else {
        setMyRating(null); // If the user hasn't rated, set it to null
      }
    }
  }, [ratings]);


  const calculateAverageRating = () => {
    if (ratings.length === 0) {
      setAverageRating(0);
    } else {
      const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
      const average = totalRating / ratings.length;
      setAverageRating(average);
    }
  };
  // Show full image and metadata
  return (
      <ScrollView>
        <Card>
          <Card.Title>{title}</Card.Title>
          {mediaType === 'image' ? (
              <Card.Image
                  source={{uri: mediaUrl + filename}}
                  resizeMode="center"
                  style={{height: 300}}
              />
          ) : (
              <Video
                  source={{uri: mediaUrl + filename}}
                  style={{height: 300}}
                  useNativeControls={true}
                  shouldPlay={true}
                  isLooping={true}
                  ref={videoRef}
              />
          )}
          <ListItem>

            <Text>{description}</Text>
          </ListItem>
          <ListItem>
            <Icon name="today" />
            <Text>{formatDate(timeAdded)}</Text>
          </ListItem>
          <ListItem>
            <Icon name="person" />
            <Text>Posted by: {owner.username}</Text>
          </ListItem>
          <ListItem>
            {userLike ? (
                <Button onPress={removeFavourite} title={'Remove from favorites'} />
            ) : (
                <Button onPress={createFavourite} title={'Add to favorites'} />
            )}
            <Text>: {likes.length}</Text>
          </ListItem>
          <ListItem>
            <AirbnbRating
                title={'Rating'}
                type={'custom'}
                starImage={WATER_IMAGE}
                count={5} // Number of stars
                size={55}
                defaultRating={averageRating}
                onFinishRating={createRating} // Pass the selected rating value to createRating
            />

            {/*<Rating*/}
            {/*  type='custom'*/}
            {/*  ratingImage={WATER_IMAGE}*/}
            {/*  // ratingColor={'#dbcd34'}*/}
            {/*  // ratingBackgroundColor={'#c8c7c8'}*/}
            {/*  selectedColor={'#dbcd34'}*/}
            {/*  unSelectedColor={'#c8c7c8'}*/}
            {/*  ratingCount={5}*/}
            {/*  imageSize={30}*/}
            {/*  showRating={true}*/}
            {/*  onFinishRating={createRating}*/}
            {/*/>*/}
          </ListItem>
          <ListItem>
            <Text>Average Rating: {averageRating.toFixed(2)}</Text>
          </ListItem>
          <ListItem>
            <Text>Your Rating: {myRating !== null ? myRating : 'Not Rated'}</Text>
          </ListItem>
          <ListItem>
            <Button
              title={'Delete Rating'}
              onPress={removeRating}
            />
          </ListItem>
          <ListItem>
            <Icon name="save" />
            <Text>{Math.round(filesize / 1024)} kB</Text>
          </ListItem>
        </Card>
      </ScrollView>
  );
};

Single.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Single;

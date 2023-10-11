import React, {useContext, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/app-config';
import {formatDate} from '../utils/functions';
import {Card, Icon, Text, ListItem, Button} from '@rneui/themed';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useMedia, useRating, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {AirbnbRating} from "react-native-elements";
import {LinearGradient} from "expo-linear-gradient";

const Single = ({route, navigation}) => {

    const [owner, setOwner] = useState({});
    const [userLike, setUserLike] = useState(false);
    const [userRating, setUserRating] = useState(false)
    const {user, update, setUpdate} = useContext(MainContext);
    const {getUserById} = useUser();
    const {deleteMedia} = useMedia()
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

    const deletePost = async () => {
        const token = await AsyncStorage.getItem('userToken');
        const response = await deleteMedia(fileId, token);
        alert('Post deleted')
        console.log(response, 'delete succes')
    };

    // Show full image and metadata

    // Show full image and metadata
    return (
        <ScrollView style={{backgroundColor: '#000000'}}>
            <Card containerStyle={styles.card}>
                <Card.Divider style={styles.cardDivider}>
                    <Card.Title style={styles.text}>{title}</Card.Title>
                    <Card.Divider style={styles.cardDivider}>
                        {mediaType === 'image' ? (
                            <Card.Image
                                source={{uri: mediaUrl + filename}}
                                resizeMode="center"
                                style={styles.image}
                            />
                        ) : (
                            <Video
                                source={{uri: mediaUrl + filename}}
                                style={{
                                    aspectRatio: 1,
                                    resizeMode: 'contain',
                                }}

                                useNativeControls={true}
                                shouldPlay={true}
                                isLooping={true}
                                ref={videoRef}
                            />
                        )}
                    </Card.Divider>
                    <ListItem containerStyle={styles.listItem}>
                        <Icon name='description' color='#ffe800'/>
                        <Text style={styles.text}>{description}</Text>
                    </ListItem>

                    <ListItem containerStyle={styles.listItem}>
                        <Icon name="today" color='#ffe800'/>
                        <Text style={styles.text}>{formatDate(timeAdded)}</Text>
                    </ListItem>
                    <ListItem containerStyle={styles.listItem}>
                        <Icon name="person" color='#ffe800'/>
                        <Text style={styles.text}>Posted by: {owner.username}</Text>
                    </ListItem>
                    <ListItem containerStyle={styles.listItem}>
                        {userLike ? (
                                <TouchableOpacity
                                    onPress={removeFavourite}>
                                    <LinearGradient
                                        style={styles.linearGradient}
                                        start={{x: 0, y: 0}}
                                        end={{x: 1, y: 1}}
                                        colors={['#d5af24', '#c09c24', '#ffea00', '#ff9900', '#F77737']}>
                                        <Text style={styles.buttonText}>Remove from favorites</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={createFavourite}>
                                <LinearGradient
                                    style={styles.linearGradient}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    colors={['#d5af24', '#c09c24', '#ffea00', '#ff9900', '#F77737']}>
                                    <Text style={styles.buttonText}>Add to favorites</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                        <Text style={styles.text}>: {likes.length}</Text>
                    </ListItem>
                </Card.Divider>
                <Card.Divider style={styles.cardDivider}>


                    <ListItem containerStyle={styles.listRating}>
                        <AirbnbRating
                            title={'Rating'}
                            type={'custom'}
                            starImage={WATER_IMAGE}
                            count={5} // Number of stars
                            size={50}
                            defaultRating={averageRating}
                            onFinishRating={createRating} // Pass the selected rating value to createRating
                        />
                    </ListItem>
                    <ListItem containerStyle={styles.listItem}>
                        <Icon name={'trending-up'} color='#ffe800'/>
                        <Text style={styles.text}>Average Rating: {averageRating}</Text>
                    </ListItem>
                    <ListItem containerStyle={styles.listItem}>
                        <Icon name={'star-border'} color='#ffe800'/>
                        <Text style={styles.text}>Your Rating: {myRating !== null ? myRating : 'Not Rated'}</Text>
                    </ListItem>


                    <ListItem containerStyle={styles.listItem}>
                        <TouchableOpacity
                            onPress={removeRating}>
                            <LinearGradient
                                style={styles.linearGradient}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                colors={['#d5af24', '#c09c24', '#ffea00', '#ff9900', '#F77737']}>
                                <Text style={styles.buttonText}>Delete Rating</Text>
                                <Icon name={'delete'} color='#000000'></Icon>
                            </LinearGradient>
                        </TouchableOpacity>
                    </ListItem>
                </Card.Divider>
                <Card.Divider style={styles.cardDivider}>
                    <ListItem containerStyle={styles.listItem}>
                        <TouchableOpacity
                            onPress={deletePost}>
                            <LinearGradient
                                style={styles.linearGradient}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                colors={['#d5af24', '#c09c24', '#ffea00', '#ff9900', '#F77737']}>
                                <Text style={styles.buttonText}>Delete post!</Text>
                                <Icon name={'delete-forever'} color='#000000'></Icon>
                            </LinearGradient>
                        </TouchableOpacity>
                    </ListItem>
                    <ListItem containerStyle={styles.listItem}>
                        <Icon name="save"  color='#ffe800' />
                        <Text style={styles.text}>{Math.round(filesize / 1024)} kB</Text>
                    </ListItem>
                </Card.Divider>
            </Card>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
    },
    image: {
        borderColor: '#ffee00',
        borderWidth: 1,
        height: 600,
        width: '100%',
        marginBottom: 15,
        resizeMode: 'cover',
    },
    video: {},
    card: {
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#000000',
        marginBottom: 10
    },
    cardDivider: {
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#ffeb00',
        marginBottom: 10
    },
    listItem: {

        backgroundColor: '#000000',
    },
    listRating:{
        backgroundColor: '#000000',
        margin: 5,
        alignItems: "center"

    },
    text: {
        textAlign: "center",
        color: '#ffeb00',

    },
    linearGradient: {
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
    },
    buttonText: {
        textAlign: "center",
        color: '#000000',
    }
});

Single.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default Single;

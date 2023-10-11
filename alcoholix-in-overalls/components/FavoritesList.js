import {useFavourite} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {Text} from "@rneui/themed";


const FavoritesList = ({navigation, userLikes}) => {
    console.log('userLikes:', userLikes);
    const {getFavouritesById} = useFavourite()
    const [favouritePosts, setFavouritePosts] = useState([]);

    const fetchUserLikes = async () => {
        try {
            const likesData = await getFavouritesById();
            setFavouritePosts(likesData);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchUserLikes();
    }, []);

    return (
        <Text>{userLikes.title}</Text>
    );
};

FavoritesList.propTypes = {
    navigation: PropTypes.object,
    userLikes: PropTypes.object,
};

export default FavoritesList;

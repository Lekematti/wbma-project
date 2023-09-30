import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text} from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RatePost = ({ itemId }) => {
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    const stars = [1, 2, 3, 4, 5];

    useEffect(() => {
        // Load the previous rating from AsyncStorage when the component mounts
        loadRating();
    }, []);

    useEffect(() => {
        // Calculate and update the average rating whenever the rating changes
        calculateAverageRating();
    }, [rating]);

    const calculateAverageRating = async () => {
        try {
            const storedRatings = await AsyncStorage.getItem(`ratings_${itemId}`);
            if (storedRatings) {
                const ratings = JSON.parse(storedRatings);
                const totalRating = ratings.reduce((sum, currentRating) => sum + currentRating, 0);
                const avgRating = totalRating / ratings.length;
                setAverageRating(avgRating.toFixed(1));
            }
        } catch (error) {
            console.error('Error calculating average rating:', error);
        }
    };

    const loadRating = async () => {
        try {
            const storedRatings = await AsyncStorage.getItem(`ratings_${itemId}`);
            if (storedRatings) {
                const ratings = JSON.parse(storedRatings);
                if (ratings.length > 0) {
                    // Load the most recent rating
                    setRating(ratings[ratings.length - 1]);
                }
            }
        } catch (error) {
            console.error('Error loading rating:', error);
        }
    };

    const saveRating = async (newRating) => {
        try {
            const storedRatings = await AsyncStorage.getItem(`ratings_${itemId}`);
            const ratings = storedRatings ? JSON.parse(storedRatings) : [];
            ratings.push(newRating);
            await AsyncStorage.setItem(`ratings_${itemId}`, JSON.stringify(ratings));
        } catch (error) {
            console.error('Error saving rating:', error);
        }
    };

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        saveRating(newRating);
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Display the star icons for rating */}
            {stars.map((index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleRatingChange(index)}
                >
                    <Icon
                        name={index <= rating ? 'star' : 'star-o'}
                        size={30}
                        color="#FFD700"
                    />
                </TouchableOpacity>
            ))}
            <Text>Average Rating: {averageRating}</Text>
        </View>
    );
};

export default RatePost;



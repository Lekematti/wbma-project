import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/app-config';
import {Avatar, Card, ListItem as RNEListItem, Text} from '@rneui/themed';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";

const ListItem = ({singleMedia, navigation}) => {
    return (
        <Card containerStyle={styles.card}>
            <TouchableOpacity>
                <RNEListItem bottomDivider containerStyle={{
                    opacity: 0.9,
                    flexDirection: 'column', // Change the flexDirection to 'column'
                    alignItems: 'center',
                    justifyContent: 'center', // Center items vertically
                    backgroundColor: '#000000'
                }}>

                    <View style={{alignItems: 'center', marginBottom: 20,}}>
                        <RNEListItem.Title style={{
                            color: '#ffeb00',
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: '#ffeb00',
                            paddingLeft: 5,
                            paddingRight: 5,
                            textAlign: 'center'
                        }}>{singleMedia.title}</RNEListItem.Title>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <View>
                            <Avatar
                                style={{
                                    width: 150, // Set the width to the desired size
                                    height: 150, // Set the height to the desired size
                                    color: '#ffeb00',
                                    borderWidth: 1,
                                    borderColor: '#ffeb00',
                                }}
                                size={100}
                                source={{uri: mediaUrl + singleMedia.thumbnails.w160}}
                            />
                        </View>

                        <TouchableOpacity onPress={() => {
                            console.log('touched', singleMedia.title);
                            navigation.navigate('Single', singleMedia);
                        }}>
                            <LinearGradient
                                style={styles.linearGradient}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                colors={['#d5af24', '#c09c24', '#ffea00', '#ff9900', '#F77737']}>
                                <Text style={styles.text}>View</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </RNEListItem>
            </TouchableOpacity>
        </Card>

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
    text: {
        textAlign: "center",
        color: '#000000',
    },
    container: {
        backgroundColor: '#000000',
    },
    card: {
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#ffec00',
        borderRadius: 5,

    },
    linearGradient: {
        borderRadius: 5,
        marginBottom: 10,
        padding: 20,

    }
});

ListItem.propTypes = {
    singleMedia: PropTypes.object,
    navigation: PropTypes.object,
};

export default ListItem;

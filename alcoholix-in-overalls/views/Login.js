import React, {useContext, useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, StyleSheet,} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Card, Text} from "@rneui/themed";
import {LinearGradient} from "expo-linear-gradient";

const Login = ({navigation}) => {
    // props is needed for navigation
    const {setIsLoggedIn, setUser} = useContext(MainContext);
    const {getUserByToken} = useUser();
    const [toggleRegister, setToggleRegister] = useState(false);

    const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            // hardcoded token validation
            const userData = await getUserByToken(token);
            console.log('token', token);
            console.log('userdata', userData);
            if (userData) {
                setIsLoggedIn(true);
                setUser(userData);
            }
        } catch (error) {
            console.log('checkToken', error);
        }
    };

    useEffect(() => {
        checkToken();
    }, []);

    return (
        <TouchableOpacity
            onPress={() => Keyboard.dismiss()}
            style={{flex: 1, backgroundColor: 'black'}}
            activeOpacity={1}
        >
            <Card containerStyle={{backgroundColor: 'black', borderColor: '#ffe800', marginTop: 100}}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    {toggleRegister ? (
                        <RegisterForm setToggleRegister={setToggleRegister}/>
                    ) : (
                        <LoginForm/>
                    )}

                    <Card.Divider containerStyle={styles.card}>
                        <TouchableOpacity
                            onPress={() => {
                                setToggleRegister(!toggleRegister);
                            }}>
                            <LinearGradient
                                style={styles.linearGradient}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                colors={['#d5af24', '#c09c24', '#ffea00', '#ff9900', '#F77737']}>

                                <Text style={styles.buttonText}>
                                    {toggleRegister ? 'Login' : 'Register'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Card.Divider>
                </KeyboardAvoidingView>
            </Card>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
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
    buttonText: {
        textAlign: "center",
        color: '#000000',
    }
});


Login.propTypes = {
    navigation: PropTypes.object,
};

export default Login;

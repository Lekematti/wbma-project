import {useForm, Controller} from 'react-hook-form';
import {useAuthentication} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {Input, Card, Text, Icon} from '@rneui/themed';
import {Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";

const LoginForm = () => {
    const {postLogin} = useAuthentication();
    const {setIsLoggedIn, setUser} = useContext(MainContext);
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm({
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const logIn = async (loginData) => {
        try {
            const loginResponse = await postLogin(loginData);
            console.log('login response', loginResponse);
            // loginResponse.user for storing token & userdata
            await AsyncStorage.setItem('userToken', loginResponse.token);
            setIsLoggedIn(true);
            setUser(loginResponse.user);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <Card containerStyle={styles.card}>
            <Card.Title style={styles.text}>Login Form</Card.Title>
            <Controller
                control={control}
                rules={{
                    required: {value: true, message: 'is required'},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                    <Input
                        placeholder="Username"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                        errorMessage={errors.username?.message}
                        color={'#ffe800'}
                    />
                )}
                name="username"
            />

            <Controller
                control={control}
                rules={{
                    maxLength: 100,
                    required: {value: true, message: 'is required'},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                    <Input
                        placeholder="password"
                        secureTextEntry
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.password?.message}
                        color={'#ffe800'}
                    />
                )}
                name="password"
            />
            <TouchableOpacity
                onPress={handleSubmit(logIn)}>
                <LinearGradient
                    style={styles.linearGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    colors={['#d5af24', '#c09c24', '#ffea00', '#ff9900', '#F77737']}>
                    <Text style={styles.buttonText}>Login</Text>
                    <Icon name="login" color='#000000'/>
                </LinearGradient>
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#000000',
        marginBottom: 10
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

export default LoginForm;

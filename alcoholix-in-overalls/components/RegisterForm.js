import React, {useContext} from 'react';
import {useUser} from '../hooks/ApiHooks';
import {Controller, useForm} from 'react-hook-form';
import {Card, Input, Text, Icon} from '@rneui/themed';
import {Alert, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from "../contexts/MainContext";
import {LinearGradient} from "expo-linear-gradient";

const RegisterForm = ({setToggleRegister}) => {
    const {setUser} = useContext(MainContext); // Access the user information from the context
    const {postUser, checkUsername} = useUser();
    const {
        control,
        handleSubmit,
        getValues,
        formState: {errors},
    } = useForm({
        defaultValues: {username: '', password: '', email: '', full_name: ''},
        mode: 'onBlur',
    });

    const register = async (registerData) => {
        console.log('Registering: ', registerData);
        try {
            delete registerData.confirm_password;
            const registerResult = await postUser(registerData);
            console.log('registration result', registerResult);
            Alert.alert('Success', registerResult.message);
            setToggleRegister(false);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <Card containerStyle={styles.card}>
            <Card.Title style={styles.text}>Registration Form</Card.Title>
            <Controller
                control={control}
                rules={{
                    required: {value: true, message: 'is required'},
                    minLength: {value: 3, message: 'min length is 3 characters'},
                    validate: async (value) => {
                        try {
                            const isAvailable = await checkUsername(value);
                            console.log('username available?', value, isAvailable);
                            return isAvailable ? isAvailable : 'Username taken';
                        } catch (error) {
                            console.error(error);
                        }
                    },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                    <Input
                        placeholder="Username"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.username?.message}
                        autoCapitalize="none"
                        color={'#ffe800'}
                    />
                )}
                name="username"
            />
            <Controller
                control={control}
                rules={{
                    required: {value: true, message: 'is required'},
                    minLength: {value: 5, message: 'min length is 5 characters'},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                    <Input
                        placeholder="Password"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={true}
                        errorMessage={errors.password?.message}
                        color={'#ffe800'}
                    />
                )}
                name="password"
            />
            <Controller
                control={control}
                rules={{
                    required: {value: true, message: 'is required'},
                    validate: (value) => {
                        const {password} = getValues();
                        // console.log('getValues password', password);
                        return value === password ? true : 'Passwords dont match!';
                    },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                    <Input
                        placeholder="Confirm password"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={true}
                        errorMessage={errors.confirm_password?.message}
                        color={'#ffe800'}
                    />
                )}
                name="confirm_password"
            />
            <Controller
                control={control}
                rules={{
                    required: {value: true, message: 'is required'},
                    pattern: {
                        // TODO: add better regexp for email
                        value: /\S+@\S+\.\S+$/,
                        message: 'must be a valid email',
                    },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                    <Input
                        placeholder="Email"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.email?.message}
                        color={'#ffe800'}
                    />
                )}
                name="email"
            />
            <Controller
                control={control}
                rules={{minLength: {value: 3, message: 'min length is 3 characters'}}}
                render={({field: {onChange, onBlur, value}}) => (
                    <Input
                        placeholder="Full name"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.full_name?.message}
                        color={'#ffe800'}
                    />
                )}
                name="full_name"
            />
            <TouchableOpacity
                onPress={handleSubmit(register)}>
                <LinearGradient
                    style={styles.linearGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    colors={['#d5af24', '#c09c24', '#ffea00', '#ff9900', '#F77737']}>
                    <Text style={styles.buttonText}>Register</Text>
                    <Icon name="app-registration" color='#000000'/>
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

RegisterForm.propTypes = {
    setToggleRegister: PropTypes.func,
};

export default RegisterForm;

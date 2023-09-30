import React, {useContext} from 'react';
import {useUser} from '../hooks/ApiHooks';
import {Controller, useForm} from 'react-hook-form';
import {Card, Button, Input} from '@rneui/themed';
import {Alert} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from "../contexts/MainContext";

const RegisterForm = ({setToggleRegister}) => {
  const { setUser } = useContext(MainContext); // Access the user information from the context
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
      console.log('registeration result', registerResult);
      Alert.alert('Success', registerResult.message);
      setToggleRegister(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Card>
      <Card.Title>Registration Form</Card.Title>
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
          />
        )}
        name="full_name"
      />
      <Button title="Register!" onPress={handleSubmit(register)} />
    </Card>
  );
};

RegisterForm.propTypes = {
  setToggleRegister: PropTypes.func,
};

export default RegisterForm;

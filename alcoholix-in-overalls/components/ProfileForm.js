import React, {useContext} from 'react';
import {useUser} from '../hooks/ApiHooks';
import {Controller, useForm} from 'react-hook-form';
import {Card, Button, Input} from '@rneui/themed';
import {Alert} from 'react-native';
import {PropTypes} from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const ProfileForm = ({user}) => {
  const {putUser, checkUsername, getUserByToken} = useUser();
  const {setUser} = useContext(MainContext);
  console.log('ProfileForm', user);
  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {...user, username: '', password: '', confirm_password: ''},
    mode: 'onBlur',
  });

  const update = async (updateData) => {
    console.log('Updating: ', updateData);
    try {
      delete updateData.confirm_password;
      // poistetaan tyhjät arvot
      for (const [i, value] of Object.entries(updateData)) {
        console.log(i, value);
        if (value === '') {
          delete updateData[i];
        }
      }
      const token = await AsyncStorage.getItem('userToken');
      const updateResult = await putUser(updateData, token);
      console.log('registeration result', updateResult);
      Alert.alert('Success', updateResult.message);
      // päivitä käyttäjän tiedot ruudulla
      const userData = await getUserByToken(token);
      setUser(userData);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Card>
      <Card.Title>Update Profile</Card.Title>
      <Controller
        control={control}
        rules={{
          minLength: {value: 3, message: 'min length is 3 characters'},
          validate: async (value) => {
            try {
              if (value.length < 3) {
                return;
              }
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
          validate: (value) => {
            const {password} = getValues();
            if (password.length < 5) {
              return;
            }
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
            autoCapitalize="none"
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
      <Button title="Update!" onPress={handleSubmit(update)} />
    </Card>
  );
};

ProfileForm.propTypes = {
  user: PropTypes.object,
};

export default ProfileForm;

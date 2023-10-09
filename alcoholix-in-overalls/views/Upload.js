import {Card, Input, Button, Text} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import {Alert, ImageBackground, SafeAreaView, StyleSheet} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, {useContext, useState} from 'react';
import {appId, placeholderImage} from '../utils/app-config';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {yellow} from "@mui/material/colors";
import back_IMAGE from "../assets/beerPhoto2.png";
import SearchBar from "../utils/search";
import List from "../components/List";
import {StatusBar} from "expo-status-bar";

const Upload = ({navigation}) => {
  const {update, setUpdate} = useContext(MainContext);
  const [image, setImage] = useState(placeholderImage);
  const [type, setType] = useState('image');
  const {postMedia, loading} = useMedia();
  const {postTag} = useTag();
  const {
    control,
    reset,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onBlur',
  });

  const upload = async (uploadData) => {
    console.log('upload', uploadData);
    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
    const filename = image.split('/').pop();

    let fileExtension = filename.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;

    formData.append('file', {
      uri: image,
      name: filename,
      type: `${type}/${fileExtension}`,
    });

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postMedia(formData, token);
      console.log('lataus', response);
      const tagResponse = await postTag(
        {
          file_id: response.file_id,
          tag: appId,
        },
        token,
      );
      console.log('postTag', tagResponse);
      setUpdate(!update);
      Alert.alert('Upload', `${response.message} (id: ${response.file_id})`, [
        {
          text: 'Ok',
          onPress: () => {
            resetForm();
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error(error.message);
    }
  };

  const resetForm = () => {
    setImage(placeholderImage);
    setType('image');
    reset();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setType(result.assets[0].type);
    }
  };

  return (

      <ImageBackground
          source={back_IMAGE}
          style={{
              height: 'auto',
              width: 'auto',
              resizeMode: "cover",
              overflow: "hidden",
              flex: 1
          }}>
          <Card containerStyle={styles.card}>
              {type === 'image' ? (
                  <Card.Image
                      source={{uri: image}}
                      style={styles.image}
                      onPress={pickImage}
                  />
              ) : (
                  <Video
                      source={{uri: image}}
                      style={styles.image}
                      useNativeControls={true}
                      resizeMode="cover"
                  />
              )}
              <Controller
                  control={control}
                  rules={{
                      required: {value: true, message: 'is required'},
                  }}
                  render={({field: {onChange, onBlur, value}}) => (
                      <Input
                          containerStyle={{color: '#ffeb00'}}
                          placeholder="Title"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          errorMessage={errors.title?.message}
                      />
                  )}
                  name="title"
              />

              <Controller
                  control={control}
                  rules={{
                      minLength: {value: 5, message: 'Min 5 characters'},
                  }}
                  render={({field: {onChange, onBlur, value}}) => (
                      <Input
                          containerStyle={{color: '#ffeb00'}}
                          placeholder="Description (optional)"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          errorMessage={errors.description?.message}
                      />
                  )}
                  name="description"
              />
              <Button title="Choose Media"
                      onPress={pickImage}
                      color={'#008c8c'}
                      titleStyle={{
                          color: '#ffeb00',
                      }}

              />
              <Button title="Reset" color={'error'} onPress={resetForm} />
              <Button
                  loading={loading}
                  disabled={
                      image === placeholderImage || errors.description || errors.title
                  }
                  title="Upload"
                  onPress={handleSubmit(upload)}
                  color={'#008c8c'}
                  titleStyle={{
                      color: '#ffeb00',
                  }}

              />
          </Card>
          <StatusBar style="auto"/>
      </ImageBackground>


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
  container: {
    backgroundColor: '#000000',
  },
  card: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 10
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;

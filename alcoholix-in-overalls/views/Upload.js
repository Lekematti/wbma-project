import {Card, Input, Text} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import {Alert, ImageBackground, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, {useContext, useState} from 'react';
import {appId, placeholderImage} from '../utils/app-config';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import back_IMAGE from "../assets/beerPhoto2.png";
import {StatusBar} from "expo-status-bar";
import {LinearGradient} from 'expo-linear-gradient';

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
      aspect: [9, 16],
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setType(result.assets[0].type);
    }
  };


  return (
    <ScrollView>
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
              style={styles.video}
              useNativeControls={true}
            />
          )}
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'is required'},
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                style={{color: '#ffeb00'}}
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
                style={{color: '#ffeb00'}}
                placeholder="Description (optional)"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.description?.message}
              />
            )}
            name="description"
          />
          <TouchableOpacity
            onPress={pickImage}>
            <LinearGradient
              style={styles.linearGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#d5af24', '#c09c24', '#ffea00', '#ff9900', '#F77737']}>
              <Text style={styles.buttonText}>Choose image</Text>
            </LinearGradient>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={resetForm}>
            <LinearGradient
              style={styles.linearGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#d5af24', '#c09c24', '#ffea00', '#ff9900', '#F77737']}>
              <Text style={styles.buttonText}>Reset</Text>
            </LinearGradient>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={handleSubmit(upload)}>

            <LinearGradient
              style={styles.linearGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#d5af24', '#c09c24', '#ffea00', '#ff9900', '#F77737']}>
              <Text style={styles.buttonText}>Upload</Text>
            </LinearGradient>
          </TouchableOpacity>

        </Card>
        <StatusBar style="auto"/>
      </ImageBackground>
    </ScrollView>

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
    color: '#ffeb00',
  },
  video: {
    aspectRatio: 1,
    resizeMode: 'center',
  },
  container: {
    backgroundColor: '#000000',
  },
  card: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 10,
    marginTop: 120
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

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;

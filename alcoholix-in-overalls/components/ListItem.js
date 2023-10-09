import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/app-config';
import {Avatar, Button, ListItem as RNEListItem} from '@rneui/themed';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';

const ListItem = ({singleMedia, navigation}) => {
  return (
    <TouchableOpacity>
      <RNEListItem bottomDivider containerStyle={
        { opacity: 0.9,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#000000'
        }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
          <Avatar
            size={100}
            source={{ uri: mediaUrl + singleMedia.thumbnails.w160 }}
          />
          <View style={{ flex: 1, marginLeft: 10,  }}>
            <RNEListItem.Title style={{ flex: 1, color: '#ffeb00'}}>{singleMedia.title}</RNEListItem.Title>
            <RNEListItem.Subtitle style={{ flex: 1, color: '#ffeb00' }}>{singleMedia.description}</RNEListItem.Subtitle>
          </View>
        </View>
        <Button
          color={'#008c8c'}
          textColor={'#'}
          title="View"
          titleStyle={{
            color: '#ffeb00',
          }}

          onPress={() => {
            console.log('touched', singleMedia.title);
            navigation.navigate('Single', singleMedia);
          }}
        />
      </RNEListItem>
    </TouchableOpacity>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;

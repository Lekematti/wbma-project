import {FlatList} from 'react-native';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';

const List = ({navigation, mediaArray}) => {
  const {update} = useContext(MainContext);

  return (
    <FlatList
      data={mediaArray}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
};

export default List;

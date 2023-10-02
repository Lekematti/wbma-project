import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <View style={styles.container}>
      <Icon name="search" size={20} color="gray" />
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={searchTerm} // Bind the value to searchTerm
        onChangeText={(text) => setSearchTerm(text)} // Handle text input changes
        onSubmitEditing={() => {} /* You can add an onSubmitEditing function if needed */}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#626262',
    padding: 10,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#ffffff',
  },
});

export default SearchBar;

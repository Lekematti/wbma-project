import React, { useContext } from 'react';
import { View, Button,} from 'react-native';
import { MainContext } from '../contexts/MainContext';
import { DefaultTheme, DarkTheme, Provider as PaperProvider } from 'react-native-paper';


const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(MainContext);

  const handleThemeToggle = () => {
    console.log('Toggle button clicked');
    console.log('Current theme:', theme);
    toggleTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <View>
      <PaperProvider theme={theme === 'light' ? DefaultTheme : DarkTheme}>
        <Button title="Toggle Theme" onPress={handleThemeToggle} />
      </PaperProvider>
    </View>
  );
};



export default ThemeToggleButton;

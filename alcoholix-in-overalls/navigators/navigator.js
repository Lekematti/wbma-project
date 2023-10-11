import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Single from '../views/Single';
import Favorites from '../views/Favorites'
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import {Icon} from '@rneui/themed';
import Upload from '../views/Upload';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Tabscreen = () => {
    return (
        <Tab.Navigator
            screenOptions={{
              headerStyle: {backgroundColor: 'black'},
              headerTitleStyle: {color: '#ffec00'},
                headerShown: false,

            }}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarStyle:{backgroundColor: 'black',borderWidth: 0,color:'#ffec00'},
                    tabBarIcon: ({}) => <Icon name="home" color={'#ffec00'}/>,
                }}

            />
            <Tab.Screen
                name="Favorites"
                component={Favorites}
                options={{
                    tabBarStyle:{backgroundColor: 'black',borderWidth: 0,color:'#ffec00'},
                    tabBarIcon: ({}) => <Icon name="bookmark" color={'#ffec00'}/>,
                }}
            />
            <Tab.Screen
                name="Upload"
                component={Upload}
                options={{
                    tabBarStyle:{backgroundColor: 'black',borderWidth: 0,color:'#ffec00'},
                    tabBarIcon: ({}) => <Icon name="cloud-upload" color={'#ffec00'}/>,
                }}
            />
            <Tab.Screen
              style={{backgroundColor: '#000000'}}
                name="Profile"
                component={Profile}
                options={{
                    tabBarStyle:{backgroundColor: 'black',borderWidth: 0,color:'#ffec00'},
                    tabBarIcon: ({}) => <Icon name="badge" color={'#ffec00'}/>,
                }}

            />
        </Tab.Navigator>
    );
};

const Stackscreen = () => {
    const {isLoggedIn} = useContext(MainContext);
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: {backgroundColor: 'black'},
            headerTitleStyle: {color: '#ffec00'},

        }}
        >
            {isLoggedIn ? (
                <>
                    <Stack.Screen
                        name="Tabs"
                        component={Tabscreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen name="Single" component={Single}/>
                </>
            ) : (
                <Stack.Screen
                    name="Login/Register"
                    component={Login}
                    options={{headerShown: false}}
                />
            )}
        </Stack.Navigator>
    );
};

const Navigator = () => {
    return (
        <NavigationContainer>
            <Stackscreen/>
        </NavigationContainer>
    );
};

export default Navigator;

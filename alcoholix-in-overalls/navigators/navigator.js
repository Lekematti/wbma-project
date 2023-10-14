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
                headerShown: false,

            }}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarStyle: {backgroundColor: 'black', borderWidth: 0, color: '#ffec00'},
                    tabBarIcon: ({}) => <Icon name="home" color={'#ffec00'}/>,
                }}

            />
            <Tab.Screen
                name="Favorites"
                component={Favorites}
                options={{
                    tabBarStyle: {backgroundColor: 'black', borderWidth: 0, color: '#ffec00'},
                    tabBarIcon: ({}) => <Icon name="bookmark" color={'#ffec00'}/>,
                }}
            />
            <Tab.Screen
                name="Upload"
                component={Upload}
                options={{
                    tabBarStyle: {backgroundColor: 'black', borderWidth: 0, color: '#ffec00'},
                    tabBarIcon: ({}) => <Icon name="cloud-upload" color={'#ffec00'}/>,
                }}
            />
            <Tab.Screen
                style={{backgroundColor: '#000000'}}
                name="Profile"
                component={Profile}
                options={{
                    tabBarStyle: {backgroundColor: 'black', borderWidth: 0, color: '#ffec00'},
                    tabBarIcon: ({}) => <Icon name="badge" color={'#ffec00'}/>,
                }}
            />
        </Tab.Navigator>
    );
};

const Stackscreen = () => {
    const {isLoggedIn} = useContext(MainContext);
    return (
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerStyle: {backgroundColor: 'black', },
            headerTitleStyle: {color: '#ffed00', fontSize: 30},
            headerTitleAlign: 'center',
            backTitle: null,
            headerTintColor: '#ffed00'
          }}
        >
            {isLoggedIn ? (
                <>
                    <Stack.Screen
                        name="Tabs"
                        component={Tabscreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                      screenOptions={{
                        headerShown: true,
                      }}
                      name="Single"
                      component={Single}/>
                </>
            ) : (
                <Stack.Screen
                  screenOptions={{
                    headerStyle: {backgroundColor: 'black'},



                  }}
                    name="Alcoholix In overalls"
                    component={Login}
                    options={{headerShown: true}}
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

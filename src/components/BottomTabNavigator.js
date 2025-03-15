import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import HomeScreen from '../Screens/HomeScreen';
import CollectDataScreen from '../Screens/CollectDataScreen';
import ProfileScreen from '../Screens/ProfileScreen';

const Tab = createBottomTabNavigator();



export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Home') {
              return <Icon name="home" size={size} color={color} />;
            } else if (route.name === 'Data Collect') {
              return <Icon name="calendar" size={size} color={color} />;
            } else if (route.name === 'Profile') {
              return (
                <Image
                  source={{ uri: 'https://via.placeholder.com/30' }}
                  style={{ width: size, height: size, borderRadius: size / 2 }}
                />
              );
            }
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'lightgray',
          tabBarStyle: { backgroundColor: '#0078D7', height: 60 },
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Data Collect" component={CollectDataScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

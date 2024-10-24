import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AppContainer from './src/screens/AppContainer';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
                <Stack.Screen name="AppContainer" component={AppContainer} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

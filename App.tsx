import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/screens/AppNavigator';


const App = () => {
    return (
        <NavigationContainer>
            <AppNavigator/>
        </NavigationContainer>

    );
};

export default App;

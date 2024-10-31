import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/screens/AppNavigator';
import { ThemeProvider } from './src/theme/themeContext';


const App = () => {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <AppNavigator/>
            </NavigationContainer>
        </ThemeProvider>

    );
};

export default App;

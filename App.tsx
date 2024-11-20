import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {LocationProvider} from './src/context/LocationContext'; // Ruta del archivo creado
import {ThemeProvider} from './src/theme/themeContext'; // Ruta del archivo de ThemeProvider
import AppNavigator from './src/screens/AppNavigator'; // Tu componente de navegación
import NotificationManager from './src/components/NotificationManager';

const App = () => {
    return (
        <ThemeProvider>
            <LocationProvider>
                <NavigationContainer>
                    <AppNavigator />
                </NavigationContainer>
                <NotificationManager />
            </LocationProvider>
        </ThemeProvider>
    );
};

export default App;

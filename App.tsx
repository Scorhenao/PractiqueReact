import React, {useEffect} from 'react';
import {AccessibilityInfo} from 'react-native'; // Use this module instead
import {NavigationContainer} from '@react-navigation/native';
import {LocationProvider} from './src/context/LocationContext'; // Ruta del archivo creado
import {ThemeProvider} from './src/context/themeContext'; // Ruta del archivo de ThemeProvider
import AppNavigator from './src/screens/AppNavigator'; // Tu componente de navegación
import NotificationManager, {notify} from './src/components/NotificationManager';

const App = () => {
    useEffect(() => {
        const checkReducedMotion = async () => {
            const isReducedMotion = await AccessibilityInfo.isReduceMotionEnabled();
            if (isReducedMotion) {
                // Mostrar una notificación de advertencia al usuario
                notify(
                    'warning',
                    'Reduced Motion Detected',
                    'Please enable animations for a better experience.',
                );
            }
        };

        checkReducedMotion();
    }, []); // Se ejecuta una sola vez al montar el componente

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

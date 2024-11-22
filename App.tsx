import React, {useEffect} from 'react';
import {AccessibilityInfo} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {LocationProvider} from './src/context/LocationContext';
import {ThemeProvider} from './src/context/themeContext';
import AppNavigator from './src/screens/AppNavigator';
import NotificationManager, {notify} from './src/components/NotificationManager';

const App = () => {
    useEffect(() => {
        const checkReducedMotion = async () => {
            const isReducedMotion = await AccessibilityInfo.isReduceMotionEnabled();
            if (isReducedMotion) {
                notify(
                    'warning',
                    'Reduced Motion Detected',
                    'Please enable animations for a better experience.',
                );
            }
        };

        checkReducedMotion();
    }, []);

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

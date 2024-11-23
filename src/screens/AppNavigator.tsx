import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SettingsScreen from './SettingsScreen';
import {RootStackParamList} from './types/NavigationTypes';
import EditContact from './EditContactScreen';
import AddContact from './AddContact';
import LoginScreen from './LoginScreen';
import SelectLocation from '../components/SelectLocation';
import ViewContact from './ViewContact';
import OnboardingScreen from './OnboardingScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import {AppContainer} from './AppContainer';
import authService from '../services/authService';
import LoadingScreen from './LoadingScreen';
import HelpScreen from './HelpScreen';
import {useTheme} from '../context/themeContext';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(false);
    const darkmode = useTheme();
    const colors = darkmode ? colorsDarkMode : colorsLightMode;

    useEffect(() => {
        const checkUserStatus = async () => {
            const token = await authService.getToken();
            const onboardingStatus = await authService.getOnboardingStatus();

            console.log('Token:', token);
            console.log('Onboarding completed:', onboardingStatus);

            setIsLoggedIn(!!token); // Si hay token, el usuario está logueado
            setIsOnboardingCompleted(onboardingStatus); // Recupera el estado del onboarding
        };

        checkUserStatus();
    }, []);

    if (isLoggedIn === null) {
        return <LoadingScreen />;
    }

    return (
        <Stack.Navigator
            initialRouteName={
                isOnboardingCompleted ? (isLoggedIn ? 'HomeScreen' : 'Login') : 'OnboardingScreen'
            }
            screenOptions={{
                headerStyle: {backgroundColor: colors.background, elevation: 100},
                headerTintColor: colors.text,
                headerTitleAlign: 'center', // Centra el título
            }}>
            <Stack.Screen
                options={{headerShown: false}}
                name="OnboardingScreen"
                component={OnboardingScreen}
            />
            <Stack.Screen name="HelpScreen" component={HelpScreen}  />
            <Stack.Screen options={{headerShown: false}} name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
                options={{headerShown: false}}
                name="AppContainer"
                component={AppContainer}
            />
            <Stack.Screen name="AddContact" component={AddContact} />
            <Stack.Screen name="EditContact" component={EditContact} />
            <Stack.Screen name="ViewContact" component={ViewContact} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen name="SelectLocation" component={SelectLocation} />

        </Stack.Navigator>
    );
}

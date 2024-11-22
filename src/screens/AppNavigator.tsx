import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SettingsScreen from './SettingsScreen';
import {RootStackParamList} from './types/NavigationTypes';
import EditContact from './EditContact';
import AddContact from './AddContact';
import LoginScreen from './Login';
import SelectLocation from '../components/SelectLocation';
import ViewContact from './ViewContact';
import OnboardingScreen from './OnboardingScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import {AppContainer} from './AppContainer';
import authService from '../services/authService'; // Import auth service
import LoadingScreen from './LoadingScreen';
import HelpScreen from './HelpScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(false);

    useEffect(() => {
        // Verificar si el usuario está logueado y si completó el onboarding
        const checkUserStatus = async () => {
            const token = await authService.getToken();
            setIsLoggedIn(!!token); // Si hay token, se considera logueado

            // Reemplaza esto con tu verificación de onboarding (por ejemplo, en almacenamiento local)
            const onboardingStatus = await authService.getOnboardingStatus(); // Verificación del estado de onboarding
            setIsOnboardingCompleted(onboardingStatus);
        };

        checkUserStatus();
    }, []);

    if (isLoggedIn === null) {
        // Mostrar pantalla de carga mientras verificamos el estado del login
        return <LoadingScreen />;
    }

    return (
        <Stack.Navigator
            initialRouteName={
                isOnboardingCompleted ? (isLoggedIn ? 'HomeScreen' : 'Login') : 'OnboardingScreen'
            }>
            <Stack.Screen
                options={{headerShown: false}}
                name="OnboardingScreen"
                component={OnboardingScreen}
            />
            <Stack.Screen name="HelpScreen" component={HelpScreen} options={{headerShown: false}} />
            <Stack.Screen options={{headerShown: false}} name="HomeScreen" component={HomeScreen} />
            <Stack.Screen
                options={{headerShown: false}}
                name="Register"
                component={RegisterScreen}
            />
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

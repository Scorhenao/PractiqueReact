import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AppContainer from './AppContainer';
import SettingsScreen from './SettingsScreen';
import {RootStackParamList} from './types/NavigationTypes';
import EditContact from './EditContact';
import AddContact from './AddContact';
import LoginScreen from './Login';
import SelectLocation from '../components/SelectLocation';
import ViewContact from './ViewContact';
import Register from './Register';
import OnboardingScreen from './OnboardingScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name="OnboardingScreen" component={OnboardingScreen} />
            <Stack.Screen options={{headerShown: false}} name="Register" component={Register} />
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

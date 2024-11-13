import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AppContainer from './AppContainer';
import AddContact from '../components/AddContact';
import EditContact from '../components/EditContact';
import ViewContact from '../components/ViewContact';
import SettingsScreen from './SettingsScreen';
import {RootStackParamList} from './types/NavigationTypes';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{headerShown: false}}
                name="AppContainer"
                component={AppContainer}
            />
            <Stack.Screen name="AddContact" component={AddContact} />
            <Stack.Screen name="EditContact" component={EditContact} />
            <Stack.Screen name="ViewContact" component={ViewContact} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        </Stack.Navigator>
    );
}

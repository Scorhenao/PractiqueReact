import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AppContainer from './AppContainer';
import AddContact from '../components/AddContact';
import EditContact from '../components/EditContact';
import ViewContact from '../components/ViewContact';
import IContact from '../components/interfaces/contact.interface';
import SelectLocation from '../components/SelectLocation';
import SettingsScreen from './SettingsScreen';

export type RootStackParamList = {
    AppContainer: undefined;
    AddContact: undefined;
    EditContact: {contact: IContact};
    ViewContact: {contact: IContact};
    SelectLocation: {onLocationSelected: (loc: {latitude: string; longitude: string}) => void}; // Agregar SelectLocation con sus parámetros
    SettingsScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{headerShown: false}}
                name="AppContainer"
                component={AppContainer}
            />
            <Stack.Screen name="AddContact" component={AddContact}/>
            <Stack.Screen name="EditContact" component={EditContact}/>
            <Stack.Screen name="ViewContact" component={ViewContact}/>
            <Stack.Screen name="SettingsScreen" component={SettingsScreen}/>{' '}
            {/* Add the SettingsScreen */}
        </Stack.Navigator>
    );
}

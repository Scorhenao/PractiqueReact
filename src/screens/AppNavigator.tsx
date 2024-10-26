import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AppContainer from './AppContainer';
import AddContact from '../components/AddContact'; // Importa la pantalla de agregar contactos

export type RootStackParamList = {
    AppContainer: undefined;
    AddContact: undefined;
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
            <Stack.Screen name="AddContact" component={AddContact} />
        </Stack.Navigator>
    );
}

import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import Contacts from 'react-native-contacts';

const SettingsScreen = () => {
    const syncContacts = async () => {
        try {
            // Request permission if needed (depending on platform)
            const permission = await Contacts.requestPermission();
            if (permission === 'authorized') {
                // Fetch contacts from the device
                const allContacts = await Contacts.getAll();
                console.log('Fetched Contacts:', allContacts);
                // Here you can update your state or handle the contacts as needed
            } else {
                console.log('Permission denied');
            }
        } catch (error) {
            console.log('Error syncing contacts:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <Button title="Sync Contacts" onPress={syncContacts} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default SettingsScreen;

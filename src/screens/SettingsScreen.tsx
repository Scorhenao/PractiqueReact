import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, ActivityIndicator, Alert} from 'react-native';
import ContactCard from '../components/ContactCard';
import {syncContacts} from '../services/contactsService'; // Import the sync service
import {useNavigation} from '@react-navigation/native'; // For navigation

interface Contact {
    recordID: string;
    givenName: string;
    phoneNumbers: {number: string}[];
    emailAddresses: {email: string}[];
    thumbnailPath: string;
}

const SettingsScreen = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation(); // For navigation after sync

    const handleSyncContacts = async () => {
        setLoading(true);
        try {
            const syncedContacts = await syncContacts(); // Use syncContacts service
            setContacts(syncedContacts);
            // Navigate to 'AppContainer' with the synced contacts
            navigation.navigate('AppContainer', {syncedContacts});
        } catch (error) {
            // If an error occurs, show an alert
            Alert.alert('Error', 'Failed to sync contacts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteContact = (recordID: string) => {
        setContacts(prevContacts => prevContacts.filter(contact => contact.recordID !== recordID));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            {/* Button to sync contacts */}
            <Button title="Sync Contacts" onPress={handleSyncContacts} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {/* Show contacts after syncing */}
            {!loading &&
                contacts.length > 0 &&
                contacts.map(contact => (
                    <ContactCard
                        key={contact.recordID} // Use recordID as the unique key
                        contact={{
                            id: Number(contact.recordID),
                            name: contact.givenName,
                            phone: contact.phoneNumbers[0]?.number || '',
                            email: contact.emailAddresses[0]?.email || '',
                            image: contact.thumbnailPath || '',
                            isEmployee: false,
                            location: null,
                        }}
                        darkMode={false}
                        onDelete={() => handleDeleteContact(contact.recordID)} // Deleting contacts
                    />
                ))}
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

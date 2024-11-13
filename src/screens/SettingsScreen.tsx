import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import Contacts from 'react-native-contacts';
import ContactCard from '../components/ContactCard';

interface Contact {
    recordID: string;
    givenName: string;
    phoneNumbers: {number: string}[];
    emailAddresses: {email: string}[];
    thumbnailPath: string;
    // Add other properties as needed
}

const SettingsScreen = () => {
    const [contacts, setContacts] = useState<Contact[]>([]); // Explicitly setting type to Contact[]

    const syncContacts = async () => {
        try {
            const permission = await Contacts.requestPermission();
            if (permission === 'authorized') {
                const allContacts = await Contacts.getAll();
                console.log('Fetched Contacts:', allContacts);
                setContacts(allContacts); // Update the state with Contact[]
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

            {contacts.map((contact, index) => (
                <ContactCard
                    key={index}
                    contact={{
                        id: Number(contact.recordID), // Convertimos recordID a número
                        name: contact.givenName,
                        phone: contact.phoneNumbers[0]?.number || '',
                        email: contact.emailAddresses[0]?.email || '',
                        image: contact.thumbnailPath || '',
                        isEmployee: false,
                        location: null,
                    }}
                    darkMode={false}
                    onDelete={(id: number) =>
                        setContacts(contacts.filter(c => Number(c.recordID) !== id))
                    }
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

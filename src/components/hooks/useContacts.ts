import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IContact from '../interfaces/contact.interface';

const useContacts = () => {
    const [contacts, setContacts] = useState<IContact[]>([]);

    useEffect(() => {
        const loadContacts = async () => {
            try {
                const storedContacts = await AsyncStorage.getItem('contacts');
                if (storedContacts) {
                    setContacts(JSON.parse(storedContacts));
                }
            } catch (error) {
                console.error('Error loading contacts from storage', error);
            }
        };

        loadContacts();
    }, []);

    const addContact = async (contact: IContact) => {
        const updatedContacts = [...contacts, contact];
        setContacts(updatedContacts);
        try {
            await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));
        } catch (error) {
            console.error('Error saving contact to storage', error);
        }
    };

    return {
        contacts,
        addContact,
    };
};

export default useContacts;

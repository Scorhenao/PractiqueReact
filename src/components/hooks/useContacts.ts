import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IContact from '../interfaces/contact.interface';
import {useIsFocused} from '@react-navigation/native';

const useContacts = () => {
    const [contacts, setContacts] = useState<IContact[]>([]);
    const focused = useIsFocused();

    // load contacts from AsyncStorage
    const loadContacts = useCallback(async () => {
        const storedContacts = await retrieveContacts();
        if (storedContacts) {
            setContacts(storedContacts);
        }
    }, []);

    // Retrieve contacts from AsyncStorage
    const retrieveContacts = async (): Promise<IContact[]> => {
        try {
            const storedData = await AsyncStorage.getItem('contacts');
            return storedData ? JSON.parse(storedData) : [];
        } catch (error) {
            console.error('Error loading contacts from storage', error);
            return [];
        }
    };

    // Add a new contact and save it in AsyncStorage
    const addContact = async (newContact: IContact) => {
        const contactWithId = {
            ...newContact,
            id: Date.now(), // or use a library to generate unique IDs
        };
        const updatedContacts = [...contacts, contactWithId];
        setContacts(updatedContacts);
        await storeContacts(updatedContacts);
    };

    // Update an existing contact and save to AsyncStorage
    const updateContact = async (updatedContact: IContact) => {
        const updatedContacts = contacts.map(contact =>
            contact.id === updatedContact.id ? updatedContact : contact,
        );
        setContacts(updatedContacts);
        await storeContacts(updatedContacts);
    };

    // Delete an existing contact and save to AsyncStorage
    const deleteContact = async (contactId: number) => {
        const updatedContacts = contacts.filter(contact => contact.id !== contactId);
        setContacts(updatedContacts);
        await storeContacts(updatedContacts);
    };

    // Save contacts to AsyncStorage
    const storeContacts = async (contactsList: IContact[]) => {
        try {
            await AsyncStorage.setItem('contacts', JSON.stringify(contactsList));
        } catch (error) {
            console.error('Error saving contacts to storage', error);
        }
    };

    // Automatically load contacts when the component is focused
    useEffect(() => {
        if (focused) {
            loadContacts();
        }
    }, [focused, loadContacts]);

    return {contacts, addContact, updateContact, deleteContact, loadContacts};
};

export default useContacts;

import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IContact from '../interfaces/contact.interface';
import { useIsFocused } from '@react-navigation/native';

const useContacts = () => {
    const [contacts, setContacts] = useState<IContact[]>([]);
    const focused = useIsFocused();

    // take contacts saved in AsyncStorage
    const loadContacts = useCallback(async () => {
        const storedContacts = await retrieveContacts();
        if (storedContacts) {
            setContacts(storedContacts);
        }
    }, []);

    // Take storage contact and return an empty array if error
    const retrieveContacts = async (): Promise<IContact[]> => {
        try {
            const storedData = await AsyncStorage.getItem('contacts');
            return storedData ? JSON.parse(storedData) : [];
        } catch (error) {
            console.error('Error loading contacts from storage', error);
            return [];
        }
    };

    // Add new contect to the list and save it in AsyncStorage
    const addContact = async (newContact: IContact) => {
        const contactWithId = {
            ...newContact,
            id: Date.now(), // O usa una librería para generar IDs únicos
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

    // Save cotacts in AsyncStorage, handling mistakes
    const storeContacts = async (contactsList: IContact[]) => {
        try {
            await AsyncStorage.setItem('contacts', JSON.stringify(contactsList));
        } catch (error) {
            console.error('Error saving contacts to storage', error);
        }
    };
    // charge contact from the component
    useEffect(() => {
        loadContacts();
    }, [loadContacts, focused]);

    return {contacts, addContact, updateContact, deleteContact, loadContacts};
};

export default useContacts;

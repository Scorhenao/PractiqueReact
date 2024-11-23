import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import IContact from '../interfaces/contact.interface';
import {useIsFocused} from '@react-navigation/native';
import {
    BaseUrl,
    GetContactsUrl,
    EditContactUrl,
    DeleteContactUrl,
    CreateContactUrl,
} from '../utils/routes';
import authService from '../services/authService';
import {Alert} from 'react-native';
import {notify} from '../components/NotificationManager';

const api = axios.create({
    baseURL: BaseUrl,
});

const useContacts = () => {
    const [contacts, setContacts] = useState<IContact[]>([]);
    const [loading, setLoading] = useState(false);
    const focused = useIsFocused();

    const getAuthHeaders = async () => {
        const token = await authService.getToken();
        if (!token) {
            console.error('No token found');
            throw new Error('No token available');
        }
        console.log('Retrieved Token:', token);
        return {
            Authorization: token ? `Bearer ${token}` : 'Bearer none',
        };
    };

    const loadContacts = useCallback(async () => {
        try {
            const headers = await getAuthHeaders();
            const response = await api.get(GetContactsUrl, {headers});
            console.log(response.data);
            setContacts(response.data);
        } catch (error: any) {
            console.error(
                'Error loading contacts from backend',
                error.response?.data || error.message,
            );
        }
    }, []);

    const getContactById = async (id: string) => {
        setLoading(true);
        try {
            const headers = await getAuthHeaders();
            const response = await api.get(`${GetContactsUrl}/${id}`, {headers});
            return response.data;
        } catch (error: any) {
            console.error('Error fetching contact by ID', error.response?.data || error.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const isDuplicateContact = (newContact: IContact) => {
        return contacts.some(
            contact => contact.name === newContact.name && contact.phone === newContact.phone,
        );
    };

    const addContact = async (newContact: IContact, imageUri?: string) => {
        try {
            if (isDuplicateContact(newContact)) {
                console.error('Contact with the same name and phone number already exists');
                return;
            }

            const formData = new FormData();
            formData.append('name', newContact.name);
            formData.append('phone', newContact.phone);

            if (newContact.email) {
                formData.append('email', newContact.email);
            }
            if (newContact.contactType) {
                formData.append('contactType', newContact.contactType);
            }
            if (newContact.latitude) {
                formData.append('latitude', newContact.latitude.toString());
            }
            if (newContact.longitude) {
                formData.append('longitude', newContact.longitude.toString());
            }

            if (imageUri) {
                formData.append('file', {
                    uri: imageUri,
                    name: 'profile.jpg',
                    type: 'image/jpeg',
                });
            }

            const headers = await getAuthHeaders();

            const response = await api.post(CreateContactUrl, formData, {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setContacts(prevContacts => [...prevContacts, response.data]);
        } catch (error: any) {
            console.error('Error adding contact to backend', error.message);
            Alert.alert('Error', 'There was an issue adding the contact.');
        }
    };

    const updateContact = async (updatedContact: IContact, imageUri?: string) => {
        try {
            const formData = new FormData();

            // Agregar los datos del contacto al FormData
            formData.append('name', updatedContact.name);
            formData.append('phone', updatedContact.phone);

            if (updatedContact.email) {
                formData.append('email', updatedContact.email);
            }
            if (updatedContact.contactType) {
                formData.append('contactType', updatedContact.contactType);
            }
            if (updatedContact.latitude) {
                formData.append('latitude', updatedContact.latitude.toString());
            }
            if (updatedContact.longitude) {
                formData.append('longitude', updatedContact.longitude.toString());
            }

            // Agregar la imagen, si existe
            if (imageUri) {
                formData.append('file', {
                    uri: imageUri,
                    name: 'profile.jpg', // Cambia el nombre si es necesario
                    type: 'image/jpeg', // Cambia el tipo MIME si es necesario
                });
            }

            const headers = await getAuthHeaders();

            // Enviar la solicitud de actualización al backend
            const response = await api.patch(`${EditContactUrl}/${updatedContact.id}`, formData, {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Actualizar la lista de contactos localmente
            setContacts(prevContacts =>
                prevContacts.map(contact =>
                    contact.id === updatedContact.id ? response.data : contact,
                ),
            );

            notify('success', 'Contact Updated', 'The contact was updated successfully.');
        } catch (error: any) {
            console.error('Error updating contact', error);
            if (error.response) {
                console.error('Server Error:', error.response.data);
                notify(
                    'danger',
                    'Server Error',
                    error.response.data.message || 'Failed to update contact.',
                );
            } else {
                console.error('Network Error:', error.message);
                notify('danger', 'Network Error', 'Network error occurred. Please try again.');
            }
        }
    };

    const deleteContact = async (contactId: number) => {
        try {
            const headers = await getAuthHeaders();
            await api.delete(`${DeleteContactUrl}/${contactId}`, {headers});
            setContacts(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
        } catch (error) {
            console.error('Error deleting contact', error);
        }
    };

    useEffect(() => {
        if (focused) {
            loadContacts();
        }
    }, [focused, loadContacts]);

    return {
        contacts,
        loading,
        getContactById,
        addContact,
        updateContact,
        deleteContact,
        loadContacts,
    };
};

export default useContacts;

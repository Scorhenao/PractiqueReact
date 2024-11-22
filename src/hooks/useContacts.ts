import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import IContact from '../interfaces/contact.interface';
import {useIsFocused} from '@react-navigation/native';
import {
    BaseUrl,
    GetContactsUrl,
    EditContactUrl,
    DeleteContactUrl,
} from '../utils/routhes';
import authService from '../services/authService'; // Import the authService
import {Alert} from 'react-native';

// Configurar instancia de Axios con BaseUrl
const api = axios.create({
    baseURL: BaseUrl,
});

const useContacts = () => {
    const [contacts, setContacts] = useState<IContact[]>([]);
    const focused = useIsFocused();

    // Función para obtener el token y configurar el encabezado de autorización
    const getAuthHeaders = async () => {
        const token = await authService.getToken();
        if (!token) {
            console.error('No token found');
            throw new Error('No token available');
        }
        console.log('Retrieved Token:', token);
        return {
            Authorization: token ? `Bearer ${token}` : 'Bearer none', // 'Bearer none' o cualquier valor adecuado
        };
    };

    // Cargar contactos desde el backend
    const loadContacts = useCallback(async () => {
        try {
            const headers = await getAuthHeaders(); // Obtener los encabezados con el token
            const response = await api.get(GetContactsUrl, {headers});
            console.log(response.data); // Verifica la respuesta
            setContacts(response.data);
        } catch (error: any) {
            console.error(
                'Error loading contacts from backend',
                error.response?.data || error.message,
            ); // Muestra el error específico
        }
    }, []);

    // Verificar si un contacto con el mismo nombre y teléfono ya existe
    const isDuplicateContact = (newContact: IContact) => {
        return contacts.some(
            contact => contact.name === newContact.name && contact.phone === newContact.phone,
        );
    };

    // Añadir un nuevo contacto
    const addContact = async (newContact: IContact, imageUri?: string) => {
        try {
            // Validate duplicate contacts
            if (isDuplicateContact(newContact)) {
                console.error('Contact with the same name and phone number already exists');
                return;
            }

            let uploadedImageUrl = '';

            // Upload image if exists
            if (imageUri) {
                const formData = new FormData();
                formData.append('file', {
                    uri: imageUri,
                    name: 'profile.jpg',
                    type: 'image/jpeg',
                });

                const uploadResponse = await api.post('/api/upload/image', formData, {
                    headers: {'Content-Type': 'multipart/form-data'},
                });
                uploadedImageUrl = uploadResponse.data.url; // Assuming the backend returns the URL
            }

            // Get authentication headers
            const headers = await getAuthHeaders();

            // Send the contact data to the backend
            const response = await api.post(
                '/api/contacts', // Ensure the correct endpoint
                {
                    ...newContact,
                    contactType: newContact.isEmployee ? 'Employee' : 'Client',
                    latitude: newContact.location?.latitude,
                    longitude: newContact.location?.longitude,
                    profilePicture: uploadedImageUrl,
                },
                {headers},
            );

            // Update the local contacts list
            setContacts(prevContacts => [...prevContacts, response.data]);
        } catch (error: any) {
            console.error('Error adding contact to backend', error.message); // Log error message
            console.error('Error details:', error.response?.data || error); // Log error response data if available
            Alert.alert('Error', 'There was an issue adding the contact.');
        }
    };

    // Actualizar contacto
    const updateContact = async (updatedContact: IContact) => {
        try {
            const headers = await getAuthHeaders(); // Obtener los encabezados con el token
            const response = await api.patch(
                `${EditContactUrl}/${updatedContact.id}`,
                updatedContact,
                {headers},
            );
            setContacts(prevContacts =>
                prevContacts.map(contact =>
                    contact.id === updatedContact.id ? response.data : contact,
                ),
            );
        } catch (error) {
            console.error('Error updating contact', error);
        }
    };

    // Eliminar contacto
    const deleteContact = async (contactId: number) => {
        try {
            const headers = await getAuthHeaders(); // Obtener los encabezados con el token
            await api.delete(`${DeleteContactUrl}/${contactId}`, {headers});
            setContacts(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
        } catch (error) {
            console.error('Error deleting contact', error);
        }
    };

    // Cargar contactos cuando la pantalla se enfoca
    useEffect(() => {
        if (focused) {
            loadContacts();
        }
    }, [focused, loadContacts]);

    return {contacts, addContact, updateContact, deleteContact, loadContacts};
};

export default useContacts;

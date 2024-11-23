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
} from '../utils/routhes';
import authService from '../services/authService'; // Import the authService
import {Alert} from 'react-native';

// Configurar instancia de Axios con BaseUrl
const api = axios.create({
    baseURL: BaseUrl,
});

const useContacts = () => {
    const [contacts, setContacts] = useState<IContact[]>([]);
    const [loading, setLoading] = useState(false); // Para manejar el estado de carga
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
            Authorization: token ? `Bearer ${token}` : 'Bearer none',
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
            );
        }
    }, []);

    // Obtener un contacto por ID
    const getContactById = async (id: string) => {
        setLoading(true); // Set loading to true while fetching data
        try {
            const headers = await getAuthHeaders(); // Obtener los encabezados con el token
            const response = await api.get(`${GetContactsUrl}/${id}`, {headers}); // Petición con el ID
            return response.data; // Retorna los datos del contacto
        } catch (error: any) {
            console.error('Error fetching contact by ID', error.response?.data || error.message);
            return null;
        } finally {
            setLoading(false); // Set loading to false after the request finishes
        }
    };

    const isDuplicateContact = (newContact: IContact) => {
        return contacts.some(
            contact => contact.name === newContact.name && contact.phone === newContact.phone,
        );
    };

    // Añadir un nuevo contacto
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

    // Actualizar contacto
    const updateContact = async (updatedContact: IContact) => {
        try {
            const headers = await getAuthHeaders();
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
            const headers = await getAuthHeaders();
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

    return {
        contacts,
        loading, // Exponer estado de carga
        getContactById,
        addContact,
        updateContact,
        deleteContact,
        loadContacts,
    };
};

export default useContacts;

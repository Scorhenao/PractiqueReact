import {useState} from 'react';
import axios from 'axios';
import {notify} from '../components/NotificationManager';
import {BaseUrl, GetContactsUrl} from '../utils/routhes';
import authService from '../services/authService';
import {handleGetContactsError} from '../utils/errors/GetContactsErrors';

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    image?: string;
    isEmployee: boolean;
    location?: string;
}

interface GetContactsResponse {
    success: boolean;
    data?: Contact[];
    message?: string;
}

export const useGetContacts = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const fetchContacts = async (): Promise<GetContactsResponse> => {
        try {
            setLoading(true);

            // Obtain the token
            const token = await authService.getToken();

            if (!token) {
                notify('danger', 'Unauthorized', 'You must log in to view contacts.');
                return {success: false, message: 'No token found'};
            }

            // Make the GET request to fetch contacts
            const response = await axios.get(`${BaseUrl}${GetContactsUrl}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                notify('success', 'Contacts Loaded', 'Contacts loaded successfully.');
                return {success: true, data: response.data};
            } else {
                notify(
                    'danger',
                    'Error Fetching Contacts',
                    response.data.message || 'Failed to load contacts.',
                );
                return {success: false, message: response.data.message};
            }
        } catch (error) {
            return handleGetContactsError(error);
        } finally {
            setLoading(false);
        }
    };

    return {fetchContacts, loading};
};

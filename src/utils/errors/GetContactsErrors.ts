import {GetContactsErrorResponse} from '../../interfaces/contacts/get/getContactsErrorResponse.interface';
import {notify} from './../../components/NotificationManager';
import {AxiosError} from 'axios';
    export const handleGetContactsError = (error: any): GetContactsErrorResponse => {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
        const {status, data} = axiosError.response;

        if (status === 401) {
            notify('danger', 'Unauthorized', 'Invalid or expired token. Please log in again.');
            return {success: false, message: 'Unauthorized'};
        }

        if (status === 500) {
            notify('danger', 'Server Error', 'The server encountered an error. Please try again.');
            return {success: false, message: 'Server error'};
        }

        if (status === 404) {
            notify('warning', 'No Contacts Found', 'No contacts are available.');
            return {success: false, message: 'No contacts found'};
        }

        notify('danger', 'Error Fetching Contacts', data?.message || 'Unexpected error occurred.');
        return {success: false, message: data?.message || 'Error fetching contacts'};
    }

    notify('danger', 'Network Error', 'Check your internet connection and try again.');
    return {success: false, message: 'Network error'};
};

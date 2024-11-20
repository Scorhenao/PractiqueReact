import { LoginErrorData } from './../../interfaces/login/LoginErrorData';
import {AxiosError} from 'axios';
import {notify} from '../../components/NotificationManager';
import {LoginErrorResponse} from '../../interfaces/login/LoginErrorResponse.interface';

export const handleLoginError = (error: AxiosError): LoginErrorResponse => {
    if (error.response) {
        const {status, data} = error.response;

        // Narrow the type of `data` to LoginErrorData using type assertion
        const errorData = data as LoginErrorData;

        // Now TypeScript knows `errorData` has a `message` property
        if (errorData && typeof errorData.message !== 'undefined') {
            const message = Array.isArray(errorData.message)
                ? errorData.message.join(', ') // If it's an array, join it
                : errorData.message; // If it's a string, use it directly

            if (status === 401) {
                notify('danger', 'Login Failed', message || 'Invalid credentials.');
                return {success: false, message};
            }

            if (status === 500) {
                notify('danger', 'Server Error', 'Internal server error. Please try again.');
                return {success: false, message: 'Internal server error'};
            }
        }
    }

    // Handle generic or network errors
    notify('danger', 'Network Error', 'Something went wrong. Please try again.');
    return {success: false, message: 'Network error'};
};

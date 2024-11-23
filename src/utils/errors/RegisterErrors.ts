import {AxiosError} from 'axios';
import {notify} from '../../components/NotificationManager';
import {RegisterErrorResponse} from '../../interfaces/contacts/register/RegisterErrorResponse.interface';
import {RegisterErrorData} from '../../interfaces/contacts/register/RegisterErrorData';

export const handleRegisterError = (error: unknown): RegisterErrorResponse => {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
        const {status, data, headers} = axiosError.response;

        // Check if the response is JSON
        if (headers['content-type'] && headers['content-type'].includes('application/json')) {
            try {
                const errorData = data as RegisterErrorData;

                if (errorData && typeof errorData.message !== 'undefined') {
                    const message = Array.isArray(errorData.message)
                        ? errorData.message.join(', ')
                        : errorData.message;

                    if (status === 400) {
                        notify('danger', 'Bad Request', message || 'Please check your input.');
                        return {success: false, message};
                    }

                    if (status === 500) {
                        notify(
                            'danger',
                            'Server Error',
                            'Internal server error. Please try again.',
                        );
                        return {success: false, message: 'Internal server error'};
                    }

                    if (status === 401) {
                        notify('danger', 'Unauthorized', message || 'Invalid credentials.');
                        return {success: false, message};
                    }
                }
            } catch (e) {
                // Handle parsing errors
                console.error('Error parsing response data:', e);
                notify('danger', 'Parsing Error', 'Unable to parse server response.');
                return {success: false, message: 'Parsing error'};
            }
        } else {
            // Handle unexpected content type
            console.error('Unexpected response content-type:', headers['content-type']);
            notify(
                'danger',
                'Unexpected Response Format',
                'The server responded with an unexpected format.',
            );
            return {success: false, message: 'Unexpected response format'};
        }
    }

    // Handle network or other errors
    notify('danger', 'Network Error', 'Something went wrong. Please try again.');
    return {success: false, message: 'Network error'};
};

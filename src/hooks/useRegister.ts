import {RegisterResponse} from '../interfaces/contacts/register/RegisterResponse.interface';
import {useState} from 'react';
import {notify} from '../components/NotificationManager';
import {BaseUrl, RegisterUrl} from '../utils/routhes';
import axios from 'axios';
import {RegisterBodyRequest} from '../interfaces/contacts/register/RegisterBodyRequest.interface';
import {RegisterErrorResponse} from '../interfaces/contacts/register/RegisterErrorResponse.interface';
import {handleRegisterError} from '../utils/errors/RegisterErrors';

export const useRegister = () => {
    const [loading, setLoading] = useState(false);

    const register = async (
        requestBody: RegisterBodyRequest,
    ): Promise<RegisterResponse | RegisterErrorResponse> => {
        try {
            setLoading(true);

            const response = await axios.post(`${BaseUrl}${RegisterUrl}`, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201 || response.status === 200) {
                notify('success', 'Registration Successful!', 'You have successfully registered.');
                return {success: true, data: response.data};
            } else {
                const message = Array.isArray(response.data.message)
                    ? response.data.message.join(', ')
                    : response.data.message;
                notify('danger', 'Registration Failed', message || 'Something went wrong.');
                return {success: false, message};
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data);
                console.error('Axios error status:', error.response?.status);
                console.error('Axios error headers:', error.response?.headers);
            }
            return handleRegisterError(error);
        } finally {
            setLoading(false);
        }
    };

    return {register, loading};
};

import {useState} from 'react';
import {notify} from '../components/NotificationManager';
import {BaseUrl, RegisterUrl} from '../utils/routhes';

export const useRegister = () => {
    const [loading, setLoading] = useState(false);

    const register = async (username: string, email: string, password: string) => {
        const requestBody = {
            email,
            password,
            name: username,
        };

        try {
            setLoading(true);
            const response = await fetch(`${BaseUrl}${RegisterUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.status === 500){
                notify('danger', 'Server error', 'Please try again later.');
            }

            if (response.ok) {
                notify('success', 'Registration Successful!', 'You have successfully registered.');
                return {success: true, data: data.data};
            } else {
                const message = Array.isArray(data.message)
                    ? data.message.join(', ')
                    : data.message;
                notify('danger', 'Registration Failed', message || 'Something went wrong.');
                return {success: false, message};
            }
        } catch (error) {
            console.error(error);
            notify('danger', 'Network Error', 'Something went wrong. Please try again.');
            return {success: false, message: 'Network error'};
        } finally {
            setLoading(false);
        }
    };

    return {register, loading};
};


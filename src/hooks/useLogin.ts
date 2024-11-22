import {LoginErrorResponse} from '../interfaces/contacts/login/LoginErrorResponse.interface';
import {LoginBodyRequest} from '../interfaces/contacts/login/LoginBodyRequest.interface';
import {LoginResponse} from '../interfaces/contacts/login/LoginResponse.interface';
import {useState} from 'react';
import axios from 'axios';
import {notify} from '../components/NotificationManager';
import {BaseUrl, LoginUrl} from '../utils/routhes';
import authService from '../services/authService';
import {LoginRequestResponse} from '../interfaces/contacts/login/LoginRequestResponse.interface';
import {handleLoginError} from './../utils/errors/LoginErrors';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);

    const login = async (
        requestBody: LoginBodyRequest,
    ): Promise<LoginResponse | LoginErrorResponse> => {
        try {
            setLoading(true);

            // Make the POST request to the login API
            const response = await axios.post<LoginRequestResponse>(
                `${BaseUrl}${LoginUrl}`,
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            const data = response.data; // Get the response data from the API

            // Check if the accessToken exists and is valid, and if the response status is 200
            if (
                data.accessToken &&
                data.accessToken !== '' &&
                data.accessToken !== null &&
                data.accessToken !== undefined &&
                response.status === 200
            ) {
                console.log('Token:', data.accessToken);  // Add this line to verify if the token is being returned correctly.

                // Store the access token using authService if valid
                await authService.setToken(data.accessToken);
            }

            // Notify the user about successful login
            notify('success', 'Login Successful!', 'You have successfully logged in.');

            return {success: true, data}; // Return the success status and data
        } catch (error: any) {
            return handleLoginError(error); // Call the error handler to handle any errors
        } finally {
            setLoading(false); // Set loading to false after the request finishes, whether successful or not
        }
    };

    return {login, loading}; // Return the login function and loading state for usage in components
};

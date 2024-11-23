import {BaseUrl, GetUserByIdUrl} from '../utils/routes';
import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TOKEN_KEY = 'userToken';

export const authService = {
    setToken: async (token: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error('Error setting token:', error);
            throw new Error('Failed to set token.');
        }
    },

    setUsername: async (username: string): Promise<void> => {
        try {
            await AsyncStorage.setItem('username', username);
        } catch (error) {
            console.error('Error setting username:', error);
            throw new Error('Failed to set username.');
        }
    },

    getToken: async (): Promise<string | null> => {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            return token;
        } catch (error) {
            console.error('Error getting token:', error);
            throw new Error('Failed to get token.');
        }
    },

    getUserIdFromToken: async (): Promise<string | null> => {
        interface payload {
            userId: string;
            email: string;
            iat: number;
        }
        const token = await authService.getToken();
        if (!token) {
            return null;
        }

        try {
            const decodedToken: payload = jwtDecode(token);
            const userId = decodedToken.userId;
            return userId;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    },

    getUserNameById: async (userId: string): Promise<string | null> => {
        try {
            const token = await authService.getToken();
            if (!token) {
                throw new Error('No token available');
            }

            // Ajustar la URL
            const response = await axios.get(`${BaseUrl}${GetUserByIdUrl}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.name;
        } catch (error: any) {
            console.error('Error fetching username by ID:', error.message);
            if (error.response?.status === 404) {
                console.warn(`User with ID ${userId} not found.`);
            }
            return null;
        }
    },

    isTokenValid: async (): Promise<boolean> => {
        const token = await authService.getToken();
        if (!token) {
            return false;
        }

        try {
            const decodedToken: any = jwtDecode(token);
            const now = Date.now() / 1000;
            return decodedToken.exp > now;
        } catch (error) {
            console.error('Error decoding token:', error);
            return false;
        }
    },

    removeToken: async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error removing token:', error);
            throw new Error('Failed to remove token.');
        }
    },

    getOnboardingStatus: async (): Promise<boolean> => {
        try {
            const status = await AsyncStorage.getItem('onboardingStatus');
            return status === 'true';
        } catch (error) {
            console.error('Error getting onboarding status:', error);
            return false;
        }
    },

    setOnboardingStatus: async (status: boolean): Promise<void> => {
        try {
            await AsyncStorage.setItem('onboardingStatus', status.toString());
        } catch (error) {
            console.error('Error setting onboarding status:', error);
        }
    },
};

export default authService;

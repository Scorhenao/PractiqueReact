import AsyncStorage from '@react-native-async-storage/async-storage';

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

    getToken: async (): Promise<string | null> => {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            return token;
        } catch (error) {
            console.error('Error getting token:', error);
            throw new Error('Failed to get token.');
        }
    },

    isTokenValid: async (): Promise<boolean> => {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            return token !== null;
        } catch (error) {
            console.error('Error verifying token:', error);
            throw new Error('Failed to verify token.');
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
};

export default authService;

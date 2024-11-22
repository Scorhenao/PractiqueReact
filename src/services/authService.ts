import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'userToken';
const ONBOARDING_KEY = 'onboardingStatus';

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

    setOnboardingStatus: async (status: boolean): Promise<void> => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(status));
        } catch (error) {
            console.error('Error setting onboarding status:', error);
        }
    },

    getOnboardingStatus: async (): Promise<boolean> => {
        try {
            const status = await AsyncStorage.getItem(ONBOARDING_KEY);
            return status ? JSON.parse(status) : false;
        } catch (error) {
            console.error('Error getting onboarding status:', error);
            return false; // Default to false if there's an error
        }
    },
};

export default authService;

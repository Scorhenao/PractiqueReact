import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkToken = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking token:', error);
        return false;
    }
};

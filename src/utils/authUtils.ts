import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkToken = async () => {
    try {
        // Verificar si el token está en AsyncStorage
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            return true; // El token existe, el usuario está autenticado
        } else {
            return false; // El token no existe, el usuario no está autenticado
        }
    } catch (error) {
        console.error('Error checking token:', error);
        return false; // Si hay un error, asumimos que no está autenticado
    }
};

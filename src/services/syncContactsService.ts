import Contacts from 'react-native-contacts';

export const syncContacts = async () => {
    try {
        const permission = await Contacts.requestPermission();
        if (permission === 'authorized') {
            // Obtener todos los contactos del dispositivo
            const allContacts = await Contacts.getAll();
            return allContacts; // Devuelve los contactos obtenidos
        } else {
            console.log('Permission denied');
            return []; // Retorna un arreglo vacío si no se otorgan permisos
        }
    } catch (error) {
        console.log('Error syncing contacts:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
};

import Contacts from 'react-native-contacts';

export const syncContacts = async () => {
    try {
        const permission = await Contacts.requestPermission();
        if (permission === 'authorized') {
            const allContacts = await Contacts.getAll();
            return allContacts;
        } else {
            console.log('Permission denied');
            return [];
        }
    } catch (error) {
        console.log('Error syncing contacts:', error);
        return [];
    }
};

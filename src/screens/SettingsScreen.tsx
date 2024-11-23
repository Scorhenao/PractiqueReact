import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, ActivityIndicator, Alert} from 'react-native';
import ContactCard from '../components/ContactCard';
import {syncContacts} from '../services/syncContactsService'; // Importar el servicio de sincronización
import {useNavigation} from '@react-navigation/native'; // Para navegación
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './types/NavigationTypes'; // Tipos de navegación
import IContact from '../interfaces/contact.interface';
import useContacts from '../hooks/useContacts';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SettingsScreen'>;

const SettingsScreen = () => {
    const [contacts, setContacts] = useState<IContact[]>([]); // Usamos IContact aquí
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<SettingsScreenNavigationProp>();
    const {addContact} = useContacts();
    // Función para sincronizar contactos
    const handleSyncContacts = async () => {
        setLoading(true);
        try {
            const syncedContacts = await syncContacts(); // Llamamos al servicio

            // Mapeamos los contactos para que coincidan con IContact
            const mappedContacts: IContact[] = syncedContacts.map(contact => ({
                id: Number(contact.recordID), // Usamos recordID como id
                name: contact.givenName,
                phone: contact.phoneNumbers[0]?.number || '',
                email: contact.emailAddresses[0]?.email || '',
                image: contact.thumbnailPath || null,
                contactType: '',
                profilePicture: '',
                isEmployee: false,
                latitude: 0,
                longitude: 0,
                location: null,
            }));

            // Enviar los contactos al backend
            for (const contact of mappedContacts) {
                await addContact(contact);
            }

            setContacts(mappedContacts);

            // Navegamos a AppContainer con los contactos sincronizados
            navigation.navigate('AppContainer', {syncContacts: mappedContacts});
        } catch (error) {
            Alert.alert('Error', 'Failed to sync contacts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteContact = (id: number) => {
        setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <Button title="Sync Contacts" onPress={handleSyncContacts} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {!loading &&
                contacts.length > 0 &&
                contacts.map(contact => (
                    <ContactCard
                        key={contact.id}
                        contact={contact}
                        darkMode={false}
                        onDelete={() => handleDeleteContact(contact.id)}
                    />
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default SettingsScreen;

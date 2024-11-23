import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, ActivityIndicator} from 'react-native';
import ContactCard from '../components/ContactCard';
import {syncContacts} from '../services/syncContactsService';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './types/NavigationTypes';
import IContact from '../interfaces/contact.interface';
import useContacts from '../hooks/useContacts';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import {useTheme} from '../context/themeContext';
import {useTranslation} from 'react-i18next';
import {notify} from '../components/NotificationManager';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SettingsScreen'>;

const SettingsScreen = () => {
    const [contacts, setContacts] = useState<IContact[]>([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<SettingsScreenNavigationProp>();
    const {addContact} = useContacts();
    const {darkmode} = useTheme();
    const colors = darkmode ? colorsLightMode : colorsDarkMode;
    const {t} = useTranslation(); // Hook para traducir textos

    const handleSyncContacts = async () => {
        setLoading(true);
        try {
            const syncedContacts = await syncContacts();

            const mappedContacts: IContact[] = syncedContacts.map(contact => ({
                id: Number(contact.recordID),
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

            for (const contact of mappedContacts) {
                await addContact(contact);
            }

            setContacts(mappedContacts);

            navigation.navigate('AppContainer', {syncContacts: mappedContacts});
        } catch (error) {
            notify('danger', t('error'), t('FailedToSyncContacts'));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteContact = (id: number) => {
        setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
    };

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <Text style={[styles.title, {color: colors.text}]}>{t('settings')}</Text>
            <Button title={t('syncContacts')} onPress={handleSyncContacts} />
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

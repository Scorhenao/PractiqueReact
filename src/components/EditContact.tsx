import React, {useState} from 'react';
import {View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../screens/AppNavigator';
import useContacts from './hooks/useContacts';
import IContact from './interfaces/contact.interface';
import {Picker} from '@react-native-picker/picker';
import {useTheme} from '../theme/themeContext';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import {useTranslation} from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {launchImageLibrary} from 'react-native-image-picker';

type EditContactScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditContact'>;

const EditContact: React.FC = () => {
    const navigation = useNavigation<EditContactScreenNavigationProp>();
    const route = useRoute();
    const {loadContacts, updateContact} = useContacts();
    const {contact} = route.params as {contact: IContact};

    const {t} = useTranslation();
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    const [name, setName] = useState(contact.name);
    const [phone, setPhone] = useState(contact.phone);
    const [email, setEmail] = useState(contact.email);
    const [image, setImage] = useState(contact.image || '');
    const [contactType, setContactType] = useState(contact.isEmployee ? 'Employee' : 'Client');

    const handleImagePick = async () => {
        const options = {
            mediaType: 'photo' as const,
            includeBase64: true,
        };

        const result = await launchImageLibrary(options);

        if (result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri; // Ensure uri is defined
            if (uri) {
                setImage(uri);
            } else {
                Alert.alert(t('error'), t('failedToGetImageUri'));
            }
        } else {
            Alert.alert(t('error'), t('failedToPickImage'));
        }
    };

    const handleSave = async () => {
        const updatedContact: IContact = {
            ...contact,
            name: name || contact.name,
            phone: phone || contact.phone,
            email: email || contact.email,
            image: image || contact.image,
            isEmployee: contactType === 'Employee',
        };

        await updateContact(updatedContact);
        await loadContacts(); // Ensure contacts are reloaded

        Alert.alert(t('success'), t('contactUpdated'), [
            {
                text: t('ok'),
                onPress: () => navigation.navigate('AppContainer'),
            },
        ]);
    };

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
                {image ? (
                    <Image source={{uri: image}} style={styles.image} />
                ) : (
                    <FontAwesome name="user-circle" size={100} color={colors.placeholder} />
                )}
                <TouchableOpacity style={styles.editIconContainer} onPress={handleImagePick}>
                    <FontAwesome name="pencil" size={24} color="#fff" />
                </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
                <FontAwesome name="user" size={20} color={colors.icon} style={styles.icon} />
                <TextInput
                    placeholder={t('namePlaceholder')}
                    value={name}
                    onChangeText={setName}
                    style={[
                        styles.input,
                        {backgroundColor: colors.inputBackground, color: colors.text},
                    ]}
                />
            </View>
            <View style={styles.inputContainer}>
                <FontAwesome name="phone" size={20} color={colors.icon} style={styles.icon} />
                <TextInput
                    placeholder={t('phonePlaceholder')}
                    value={phone}
                    onChangeText={setPhone}
                    style={[
                        styles.input,
                        {backgroundColor: colors.inputBackground, color: colors.text},
                    ]}
                />
            </View>
            <View style={styles.inputContainer}>
                <FontAwesome name="envelope" size={20} color={colors.icon} style={styles.icon} />
                <TextInput
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChangeText={setEmail}
                    style={[
                        styles.input,
                        {backgroundColor: colors.inputBackground, color: colors.text},
                    ]}
                />
            </View>
            <Picker
                selectedValue={contactType}
                onValueChange={itemValue => setContactType(itemValue)}
                style={{color: colors.text, backgroundColor: colors.inputBackground}}>
                <Picker.Item label={t('employee')} value="Employee" />
                <Picker.Item label={t('client')} value="Client" />
            </Picker>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <FontAwesome name="save" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>{t('save')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative', // Enable positioning of edit icon
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 10,
        right: 90,
        backgroundColor: '#007BFF', // Icon background color
        borderRadius: 50,
        padding: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        height: 40,
        flex: 1,
    },
    saveButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10, // Space between icon and text
    },
});

export default EditContact;

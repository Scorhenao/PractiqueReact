import React, {useState} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity, Text, Image, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Picker} from '@react-native-picker/picker';
import {useTheme} from '../context/themeContext';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import {useTranslation} from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {launchImageLibrary} from 'react-native-image-picker';
import MapView, {Marker} from 'react-native-maps';
import IContact from '../interfaces/contact.interface';
import useContacts from '../hooks/useContacts';
import {RootStackParamList} from './types/NavigationTypes';
import {notify} from '../components/NotificationManager';

type EditContactScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditContact'>;

const EditContact: React.FC = () => {
    const navigation = useNavigation<EditContactScreenNavigationProp>();
    const route = useRoute();
    const {contact} = route.params as {contact: IContact};
    const {loadContacts, updateContact} = useContacts();
    const {t} = useTranslation();
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    const [name, setName] = useState(contact.name || '');
    const [phone, setPhone] = useState(contact.phone || '');
    const [email, setEmail] = useState(contact.email || '');
    const [image, setImage] = useState(contact.image || '');
    const [contactType, setContactType] = useState(contact.isEmployee ? 'Employee' : 'Client');
    const [location, setLocation] = useState(contact.location || {latitude: 0, longitude: 0});

    const handleImagePick = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                includeBase64: true,
            });

            if (result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                if (uri) {
                    setImage(uri);
                } else {
                    notify('danger', t('error'), t('failedToPickImage'));
                }
            } else {
                notify('danger', t('error'), t('noImageSelected'));
            }
        } catch (error) {
            console.error('Error picking image:', error);
            notify('danger', t('error'), t('failedToPickImage'));
        }
    };

    const handleSave = async () => {
        if (!name.trim() || !phone.trim()) {
            notify('warning', t('warning'), t('nameAndPhoneRequired'));
            return;
        }

        const updatedContact: IContact = {
            ...contact,
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim() || '',
            isEmployee: contactType === 'Employee',
            latitude: location.latitude,
            longitude: location.longitude,
        };

        try {
            // Llama a updateContact con los datos y la imagen (si existe)
            await updateContact(updatedContact, image);
            await loadContacts();
            notify('success', t('success'), t('contactUpdatedSuccessfully'));
            navigation.goBack();
        } catch (error) {
            console.error('Error updating contact:', error);
            notify('danger', t('error'), t('failedToUpdateContact'));
        }
    };

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}>
                {/* Image Picker */}
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

                {/* Name, Phone, Email Inputs */}
                <View style={styles.inputContainer}>
                    <FontAwesome name="user" size={20} style={styles.icon} />
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
                    <FontAwesome name="phone" size={20} style={styles.icon} />
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
                    <FontAwesome name="envelope" size={20} />
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

                {/* Contact Type Picker */}
                <Picker
                    selectedValue={contactType}
                    onValueChange={itemValue => setContactType(itemValue)}
                    style={{color: colors.text, backgroundColor: colors.inputBackground}}>
                    <Picker.Item label={t('employee')} value="Employee" />
                    <Picker.Item label={t('client')} value="Client" />
                </Picker>

                {/* Map View */}
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        onPress={e => setLocation(e.nativeEvent.coordinate)}>
                        <Marker coordinate={location} />
                    </MapView>
                </View>

                {/* Save Button */}
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <FontAwesome name="save" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>{t('save')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative',
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
        backgroundColor: '#007BFF',
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
        marginLeft: 10,
    },
    mapContainer: {
        marginVertical: 20,
        height: 200,
    },
    map: {
        flex: 1,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
});

export default EditContact;

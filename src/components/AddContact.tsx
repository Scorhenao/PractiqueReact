import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Text} from 'react-native';
import {launchImageLibrary, launchCamera, ImagePickerResponse} from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-picker/picker';
import colorsDarkMode from '../theme/colorsLightMode';
import colorsLightMode from '../theme/colorsDarkMode';
import useContacts from './hooks/useContacts';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../theme/themeContext';
import {useTranslation} from 'react-i18next';
import IContact from './interfaces/contact.interface';
import {RootStackParamList} from '../screens/types/NavigationTypes';

const AddContact = () => {
    const {t} = useTranslation();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [contactType, setContactType] = useState('Client');
    const [imageUri, setImageUri] = useState('');

    const {addContact} = useContacts();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsDarkMode : colorsLightMode;

    const handleImagePick = async (source: 'camera' | 'gallery') => {
        const options = {
            mediaType: 'photo' as const,
            includeBase64: true,
        };

        let result: ImagePickerResponse;

        if (source === 'camera') {
            result = await launchCamera(options);
        } else {
            result = await launchImageLibrary(options);
        }

        if (result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri; // Ensure uri is defined
            if (uri) {
                setImageUri(uri);
            } else {
                Alert.alert('Error', 'Failed to get image URI');
            }
        } else {
            Alert.alert('Error', 'Failed to pick an image');
        }
    };

    const handleSave = () => {
        if (!name || !phone) {
            Alert.alert(t('errorMessage'), t('fillRequiredFields'));
            return;
        }

        const currentContacts = []; // Replace this with your actual contacts array

        const newContact: IContact = {
            id: currentContacts.length + 1, // Simple incremental ID
            name,
            phone,
            email,
            image: imageUri,
            isEmployee: contactType === 'Employee',
        };

        addContact(newContact);
        Alert.alert(t('successMessage')); // Show success message
        navigation.goBack();
    };

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <TextInput
                placeholder={t('namePlaceholder')}
                placeholderTextColor={colors.placeholder}
                style={[
                    styles.input,
                    {backgroundColor: colors.inputBackground, color: colors.text},
                ]}
                onChangeText={setName}
            />
            <TextInput
                placeholder={t('phonePlaceholder')}
                placeholderTextColor={colors.placeholder}
                style={[
                    styles.input,
                    {backgroundColor: colors.inputBackground, color: colors.text},
                ]}
                onChangeText={setPhone}
            />
            <TextInput
                placeholder={t('emailPlaceholder')}
                placeholderTextColor={colors.placeholder}
                style={[
                    styles.input,
                    {backgroundColor: colors.inputBackground, color: colors.text},
                ]}
                onChangeText={setEmail}
            />
            <Picker
                selectedValue={contactType}
                style={{color: colors.text, backgroundColor: colors.inputBackground}}
                onValueChange={itemValue => setContactType(itemValue)}>
                <Picker.Item label={t('client')} value="Client" />
                <Picker.Item label={t('employee')} value="Employee" />
            </Picker>
            {!imageUri && <Text style={styles.noImageSelected}>{t('noImageSelected')}</Text>}
            {imageUri ? <Image source={{uri: imageUri}} style={styles.image} /> : null}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleImagePick('gallery')} style={styles.button}>
                    <FontAwesome name="photo" size={20} color={colors.text} />
                    <Text style={[styles.buttonText, {color: colors.text}]}>
                        {t('chooseImage')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleImagePick('camera')} style={styles.button}>
                    <FontAwesome name="camera" size={20} color={colors.text} />
                    <Text style={[styles.buttonText, {color: colors.text}]}>
                        {t('takePicture')}
                    </Text>
                </TouchableOpacity>
            </View>
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
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    buttonText: {
        marginLeft: 10,
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
        marginLeft: 5, // Add some space between icon and text
    },
    noImageSelected: {
        color: '#FFCCCB', // Light red color
        marginTop: 6,
        marginBottom: 6,
        textAlign: 'center', // Center the text
    },
});

export default AddContact;

// AddContact.tsx
import React, {useState} from 'react';
import {View, TextInput, Button, Image, StyleSheet, Alert} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsWhiteMode';
import useContacts from './hooks/useContacts';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screens/AppNavigator';

type AddContactScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddContact'>;


const AddContact = ({darkMode}: {darkMode: boolean}) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [contactType, setContactType] = useState<'Employee' | 'Client'>('Employee');

    const {addContact} = useContacts();
    const navigation =  useNavigation<AddContactScreenNavigationProp>(); // Initialize useNavigation

    const handleSave = () => {
        if (!name || !phone || !email) {
            Alert.alert('Error', 'Please fill all fields before saving.');
            return;
        }

        const newContact = {name, phone, email, image, isEmployee: contactType === 'Employee'};
        addContact(newContact);

        Alert.alert('Success', 'Contact added successfully!', [
            {
                text: 'OK',
                onPress: () => navigation.navigate('AppContainer'), // Navigate back to AppContainer
            },
        ]);

        // Reset form fields
        setName('');
        setPhone('');
        setEmail('');
        setImage(null);
        setContactType('Employee');
    };

    const handleChooseImage = () => {
        launchImageLibrary({mediaType: 'photo', maxWidth: 300, maxHeight: 300}, response => {
            if (response.assets && response.assets.length > 0) {
                setImage(response.assets[0].uri || null);
            }
        });
    };

    // TODO:=> I need to put a permition modal SERVICIO EXTERNO EN LA NUBE CON CLOUDINARY
    const handleTakePicture = () => {
        launchCamera({mediaType: 'photo', maxWidth: 300, maxHeight: 300}, response => {
            if (response.assets && response.assets.length > 0) {
                setImage(response.assets[0].uri || null);
            }
        });
    };

    const colors = darkMode ? colorsDarkMode : colorsLightMode;

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={[styles.input, {borderColor: colors.text, color: colors.text}]}
                placeholderTextColor={colors.text}
            />
            <TextInput
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                style={[styles.input, {borderColor: colors.text, color: colors.text}]}
                placeholderTextColor={colors.text}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={[styles.input, {borderColor: colors.text, color: colors.text}]}
                placeholderTextColor={colors.text}
            />

            <Picker
                selectedValue={contactType}
                style={{height: 50, width: '100%', backgroundColor: colors.link}}
                onValueChange={itemValue => setContactType(itemValue)}>
                <Picker.Item label="Employee" value="Employee" />
                <Picker.Item label="Client" value="Client" />
            </Picker>

            {image && <Image source={{uri: image}} style={styles.image} />}
            <Button title="Choose Image" onPress={handleChooseImage} color={colors.primary} />
            <Button title="Take Picture" onPress={handleTakePicture} color={colors.primary} />
            <Button title="Save Contact" onPress={handleSave} color={colors.primary} />
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
        marginBottom: 10,
        paddingHorizontal: 8,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
        borderRadius: 8,
    },
});

export default AddContact;

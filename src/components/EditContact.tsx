import React, {useState} from 'react';
import {View, TextInput, Button, Image, StyleSheet, Alert} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsWhiteMode';
import useContacts from './hooks/useContacts';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../screens/AppNavigator';

type EditContactScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditContact'>;

const EditContact = ({darkMode}: {darkMode: boolean}) => {
    const route = useRoute<any>(); // taking the params to the screen
    const {contact} = route.params; // taking the contact from the params

    const [name, setName] = useState(contact.name);
    const [phone, setPhone] = useState(contact.phone);
    const [email, setEmail] = useState(contact.email);
    const [image, setImage] = useState<string | null>(contact.image);
    const [contactType, setContactType] = useState<'Employee' | 'Client'>(
        contact.isEmployee ? 'Employee' : 'Client',
    );

    const {contacts, setContacts} = useContacts();
    const navigation = useNavigation<EditContactScreenNavigationProp>();

    const handleSave = () => {
        const updatedContact = {
            ...contact,
            name,
            phone,
            email,
            image,
            isEmployee: contactType === 'Employee',
        };

        const updatedContacts = contacts.map(c => (c.phone === contact.phone ? updatedContact : c));

        setContacts(updatedContacts);

        Alert.alert('Success', 'Contact updated successfully!', [
            {
                text: 'OK',
                onPress: () => navigation.navigate('AppContainer'),
            },
        ]);
    };

    const handleChooseImage = () => {
        launchImageLibrary({mediaType: 'photo', maxWidth: 300, maxHeight: 300}, response => {
            if (response.assets && response.assets.length > 0) {
                setImage(response.assets[0].uri || null);
            }
        });
    };

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

export default EditContact;

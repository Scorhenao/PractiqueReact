import React, {useState} from 'react';
import {View, TextInput, Button, Alert, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../screens/AppNavigator';
import useContacts from './hooks/useContacts';
import IContact from './interfaces/contact.interface';
import {Picker} from '@react-native-picker/picker'; // Importación correcta

type EditContactScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditContact'>;

const EditContact = () => {
    const navigation = useNavigation<EditContactScreenNavigationProp>();
    const route = useRoute();
    const {loadContacts} = useContacts();
    const {contact} = route.params as {contact: IContact}; // Asegúrate de que esta línea esté correcta
    const [name, setName] = useState(contact.name);
    const [phone, setPhone] = useState(contact.phone);
    const [email, setEmail] = useState(contact.email);
    const [image, setImage] = useState(contact.image || '');
    const [contactType, setContactType] = useState(contact.isEmployee ? 'Employee' : 'Client');

    const {updateContact} = useContacts();

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
        await loadContacts(); // Asegúrate de recargar los contactos

        Alert.alert('Success', 'Contact updated successfully!', [
            {
                text: 'OK',
                onPress: () => navigation.navigate('AppContainer'),
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Image URL"
                value={image}
                onChangeText={setImage}
                style={styles.input}
            />
            {/* Picker for contact type */}
            <Picker
                selectedValue={contactType}
                onValueChange={itemValue => setContactType(itemValue)}
                style={styles.picker}>
                <Picker.Item label="Employee" value="Employee" />
                <Picker.Item label="Client" value="Client" />
            </Picker>
            <Button title="Save Changes" onPress={handleSave} />
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
        borderRadius: 8,
    },
    picker: {
        height: 50,
        width: 150,
    },
});

export default EditContact;

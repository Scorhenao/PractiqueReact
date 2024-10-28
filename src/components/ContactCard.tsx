import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, Modal} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsWhiteMode';
import {EditContactScreenNavigationProp} from '../screens/types/NavigationTypes';
import IContact from './interfaces/contact.interface';

interface ContactCardProps {
    contact: IContact;
    darkMode: boolean;
    onDelete: (id: number) => void; // Prop para manejar la eliminación
}

const ContactCard: React.FC<ContactCardProps> = ({
    contact, // Destructure contact from props
    darkMode,
    onDelete, // Destructure onDelete from props
}) => {
    const {phone, name, image, isEmployee, id} = contact; // Destructure the properties from the contact

    const [modalVisible, setModalVisible] = useState(false);
    const colors = darkMode ? colorsDarkMode : colorsLightMode;

    // Define the navigation type
    const navigation = useNavigation<EditContactScreenNavigationProp>(); // Specify navigation type

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <Text style={[styles.phoneNumber, {color: colors.text}]}>{phone}</Text>
            <View style={[styles.separator, {backgroundColor: colors.secondaryBackground}]} />
            <TouchableOpacity style={styles.contactInfo} onLongPress={toggleModal}>
                <View style={styles.imageContainer}>
                    <Image source={{uri: image}} style={styles.contactImage} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.contactName, {color: colors.text}]}>{name}</Text>
                    <View
                        style={[
                            styles.label,
                            isEmployee
                                ? {backgroundColor: colors.primary}
                                : {backgroundColor: colors.link},
                        ]}>
                        <Text style={styles.labelText}>{isEmployee ? 'Employee' : 'Client'}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={toggleModal}>
                <View style={styles.modalContainer}>
                    <View
                        style={[
                            styles.modalContent,
                            {backgroundColor: colors.secondaryBackground},
                        ]}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('EditContact', {
                                    contact: {...contact}, // Pass the entire contact object
                                });
                            }}>
                            <FontAwesome name="pencil" size={20} color={colors.text} />
                            <Text style={[styles.modalButtonText, {color: colors.text}]}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                onDelete(id); // Llama a la función de eliminación
                                setModalVisible(false); // Cierra el modal
                            }}>
                            <FontAwesome name="trash" size={20} color="#FF0000" />
                            <Text style={[styles.modalButtonText]}>Delete</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleModal} style={styles.modalClose}>
                            <Text style={{color: colors.link}}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
    },
    phoneNumber: {
        fontSize: 16,
        flex: 1,
    },
    separator: {
        width: 1,
        height: '100%',
        marginHorizontal: 10,
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 3,
    },
    imageContainer: {
        position: 'relative',
    },
    contactImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    label: {
        marginTop: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    labelText: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: 200,
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    modalButtonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#FF0000',
    },
    modalClose: {
        marginTop: 10,
    },
});

export default ContactCard;

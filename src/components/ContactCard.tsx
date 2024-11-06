import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, Modal} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import colorsDarkMode from '../theme/colorsLightMode';
import colorsLightMode from '../theme/colorsDarkMode';
import {EditContactScreenNavigationProp} from '../screens/types/NavigationTypes';
import IContact from './interfaces/contact.interface';
import i18n from '../i18n';

interface ContactCardProps {
    contact: IContact;
    darkMode: boolean;
    onDelete: (id: number) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({contact, darkMode, onDelete}) => {
    const {phone, name, image, isEmployee, id} = contact;

    const [modalVisible, setModalVisible] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [hover, setHover] = useState(false); // State for hover effect
    const colors = darkMode ? colorsDarkMode : colorsLightMode;

    const navigation = useNavigation<EditContactScreenNavigationProp>();

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleDelete = () => {
        onDelete(id);
        setConfirmDeleteVisible(false);
    };

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <TouchableOpacity style={styles.contactInfo} onLongPress={toggleModal}>
                <View style={styles.imageContainer}>
                    <Image source={{uri: image}} style={styles.contactImage} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.contactName, {color: colors.textContacts}]}>{name}</Text>
                    <Text style={[styles.phoneNumber, {color: colors.textContacts}]}>{phone}</Text>
                    <View
                        style={[
                            styles.label,
                            isEmployee
                                ? {backgroundColor: colors.primary}
                                : {backgroundColor: colors.link},
                        ]}>
                        <Text style={styles.labelText}>
                            {isEmployee ? i18n.t('employee') : i18n.t('client')}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dotsIconContainer} onPress={toggleModal}>
                <FontAwesome name="ellipsis-v" size={20} color={colors.textContacts} />
            </TouchableOpacity>

            {/* Modal for options */}
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
                                navigation.navigate('EditContact', {contact});
                            }}>
                            <FontAwesome name="pencil" size={20} color={colors.text} />
                            <Text style={[styles.modalButtonText, {color: colors.text}]}>
                                {i18n.t('edit')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('ViewContact', {contact});
                            }}>
                            <FontAwesome name="eye" size={20} color={colors.text} />
                            <Text style={[styles.modalButtonText, {color: colors.text}]}>
                                {i18n.t('viewMore')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                setConfirmDeleteVisible(true);
                            }}>
                            <FontAwesome name="trash" size={20} color="#FF0000" />
                            <Text style={[styles.modalButtonText]}>{i18n.t('delete')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleModal} style={styles.modalClose}>
                            <Text style={{color: colors.link}}>{i18n.t('close')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de confirmación de eliminación */}
            <Modal
                transparent={true}
                visible={confirmDeleteVisible}
                animationType="fade"
                onRequestClose={() => setConfirmDeleteVisible(false)}>
                <View style={styles.modalContainer}>
                    <View
                        style={[
                            styles.modalContent,
                            {backgroundColor: colors.secondaryBackground},
                        ]}>
                        <Text style={[styles.confirmText, {color: colors.text}]}>
                            Are you sure you want to delete this contact?
                        </Text>
                        <View style={styles.confirmButtonContainer}>
                            <TouchableOpacity onPress={handleDelete} style={styles.confirmButton}>
                                <Text style={{color: '#FF0000'}}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setConfirmDeleteVisible(false)}
                                style={styles.confirmButton}>
                                <Text style={{color: colors.link}}>No</Text>
                            </TouchableOpacity>
                        </View>
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
        fontSize: 14,
        marginTop: 4,
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 3,
        paddingRight: 10, // Adjusted to make space for the icon
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
        justifyContent: 'center',
    },
    contactName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    label: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        paddingHorizontal: 6,
        paddingVertical: 2,
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
    confirmText: {
        marginBottom: 20,
        textAlign: 'center',
    },
    confirmButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    confirmButton: {
        padding: 10,
    },
    dotsIconContainer: {
        position: 'absolute',
        right: 10, // Positioning the dots icon to the right
        top: 16, // Adjust vertical position as needed
        marginRight: 16,
    },
    hoverEffect: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.8)', // Change color as needed
        borderRadius: 50,
    },
});

export default ContactCard;

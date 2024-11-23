import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import colorsDarkMode from '../theme/colorsLightMode';
import colorsLightMode from '../theme/colorsDarkMode';

interface DeleteContactModalProps {
    visible: boolean;
    onClose: () => void;
    onDelete: () => void;
    darkMode: boolean;
}

const DeleteContactModal: React.FC<DeleteContactModalProps> = ({
    visible,
    onClose,
    onDelete,
    darkMode,
}) => {
    const colors = darkMode ? colorsDarkMode : colorsLightMode;

    return (
        <Modal transparent={true} visible={visible} animationType="fade">
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, {backgroundColor: colors.secondaryBackground}]}>
                    <Text style={[styles.modalText, {color: colors.text}]}>
                        Are you sure you want to delete this contact?
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={[styles.buttonText, {color: colors.link}]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={onDelete}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        width: 300,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        width: '45%',
    },
    deleteButton: {
        backgroundColor: '#FF0000',
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFF',
        fontSize: 16,
    },
});

export default DeleteContactModal;

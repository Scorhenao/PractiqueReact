import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

// Definimos una interfaz para las propiedades
interface AddFloatingButtonProps {
    buttonColor: string; // Especificamos que buttonColor es de tipo string
}

const AddFloatingButton: React.FC<AddFloatingButtonProps> = ({buttonColor}) => {
    const navigation = useNavigation();

    const handleAddContact = () => {
        navigation.navigate('AddContact');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, {backgroundColor: buttonColor}]}
                onPress={handleAddContact}>
                <FontAwesome name="plus" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        zIndex: 1,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
    },
});

export default AddFloatingButton;

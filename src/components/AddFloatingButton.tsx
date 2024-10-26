import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native'; // Para navegación

const AddFloatingButton = () => {
    const navigation = useNavigation();

    const handleAddContact = () => {
        navigation.navigate('AddContact'); //'AddContact' screen where you add contacts
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleAddContact}>
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
        backgroundColor: '#4CAF50',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // shadow in Android
        shadowColor: '#000', // shadow in iOS
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
    },
});

export default AddFloatingButton;

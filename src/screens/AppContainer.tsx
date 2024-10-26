import React from 'react';
import NavBar from '../components/navBar';
import ContactCard from '../components/ContactCard';
import AddFloatingButton from '../components/AddFloatingButton';
import {StyleSheet, View} from 'react-native';
import useContacts from '../components/hooks/useContacts';

const AppContainer = () => {
    const {contacts} = useContacts();

    const defaultImageUrl = 'https://customstickers.com/cdn/shop/products/STKDC-071MortyFace2.jpg?v=1707353170';

    return (
        <View style={styles.container}>
            <NavBar />
            {contacts.map((contact, index) => (
                <ContactCard
                    key={index}
                    phoneNumber={contact.phone}
                    contactName={contact.name}
                    contactImage={contact.image || defaultImageUrl} // Agrega una URL de imagen por defecto si no hay imagen
                    isEmployee={true} // Cambia esto según tu lógica para empleados y clientes
                    darkMode={true} // Cambia según la lógica de tu aplicación
                />
            ))}
            <AddFloatingButton />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default AppContainer;

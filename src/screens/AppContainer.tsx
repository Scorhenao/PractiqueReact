import React, {useState} from 'react';
import NavBar from '../components/navBar';
import ContactCard from '../components/ContactCard';
import AddFloatingButton from '../components/AddFloatingButton';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import useContacts from '../components/hooks/useContacts';

const AppContainer = () => {
    const {contacts, loadContacts} = useContacts();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadContacts(); //load the updated list of contacts
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <NavBar />
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {contacts.map((contact, index) => (
                    <ContactCard
                        key={index}
                        contact={contact} // Pass the contact object
                        darkMode={true} // Dark or light mode
                    />
                ))}
            </ScrollView>
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

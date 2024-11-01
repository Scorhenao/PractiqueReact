import React, {useState} from 'react';
import NavBar from '../components/navBar';
import ContactCard from '../components/ContactCard';
import AddFloatingButton from '../components/AddFloatingButton';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import useContacts from '../components/hooks/useContacts';
import {useTheme} from '../theme/themeContext'; // Import the Theme Context
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';

const AppContainer = () => {
    const {contacts, loadContacts, deleteContact} = useContacts();
    const [refreshing, setRefreshing] = useState(false);

    const {darkMode} = useTheme(); // Get darkMode from context

    const onRefresh = async () => {
        setRefreshing(true);
        await loadContacts(); // Load the updated list of contacts
        setRefreshing(false);
    };

    // Theme colors based on darkMode state
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <NavBar />
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {contacts.map((contact, index) => (
                    <ContactCard
                        key={index}
                        contact={contact} // Pass the contact object
                        darkMode={darkMode} // Pass darkMode to ContactCard
                        onDelete={deleteContact}
                    />
                ))}
            </ScrollView>
            <AddFloatingButton
                buttonColor={darkMode ? colorsDarkMode.link : colorsLightMode.link}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default AppContainer;

import React, {useState} from 'react';
import {ScrollView, RefreshControl, StyleSheet, View} from 'react-native';
import ContactCard from '../components/ContactCard';
import AddFloatingButton from '../components/AddFloatingButton';
import useContacts from '../components/hooks/useContacts';
import {useTheme} from '../theme/themeContext';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import LoadingAnimation from '../components/AnimatedTextComponent';
import NavBar from '../components/navBar';

const AppContainer: React.FC = () => {
    const {contacts, loadContacts, deleteContact} = useContacts();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const {darkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    const onRefresh = async () => {
        setRefreshing(true);
        await loadContacts();
        setRefreshing(false);
    };

    const handleAnimationFinish = () => {
        // Introducing a small delay before hiding the animation and showing the content
        setTimeout(() => {
            setLoading(false);
        }, 6000); // Adjust the delay if needed
    };

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            {loading ? (
                <LoadingAnimation onFinished={handleAnimationFinish} />
            ) : (
                <>
                    <NavBar />
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }>
                        {contacts.map((contact, index) => (
                            <ContactCard
                                key={index}
                                contact={contact}
                                darkMode={darkMode}
                                onDelete={deleteContact}
                            />
                        ))}
                    </ScrollView>
                    <AddFloatingButton
                        buttonColor={darkMode ? colorsDarkMode.link : colorsLightMode.link}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default AppContainer;

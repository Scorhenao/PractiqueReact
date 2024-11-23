import React, {useState, useRef, useMemo} from 'react';
import {
    StyleSheet,
    View,
    RefreshControl,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
    SectionList,
} from 'react-native';
import ContactCard from '../components/ContactCard';
import AddFloatingButton from '../components/AddFloatingButton';
import useContacts from '../hooks/useContacts';
import {useTheme} from '../context/themeContext';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import NavBar from '../components/navBar';
import IContact from '../interfaces/contact.interface';
import LoadingAnimation from '../components/AnimatedTextComponent';

export const AppContainer: React.FC = () => {
    const {contacts, loadContacts, deleteContact} = useContacts();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    const onRefresh = () => {
        setRefreshing(true);
        loadContacts();
        setRefreshing(false);
    };

    const closeDropdown = () => {
        setDropdownVisible(false);
        Keyboard.dismiss();
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const groupedContacts = useMemo(() => {
        const groups: {[key: string]: IContact[]} = {};
        contacts.forEach(contact => {
            const firstLetter = contact.name.charAt(0).toUpperCase();
            if (!groups[firstLetter]) {
                groups[firstLetter] = [];
            }
            groups[firstLetter].push(contact);
        });

        return Object.keys(groups)
            .sort()
            .map(letter => ({
                title: letter,
                data: groups[letter],
            }));
    }, [contacts]);

    const containerRef = useRef<View>(null);

    return (
        <TouchableWithoutFeedback onPress={closeDropdown}>
            <View
                style={[styles.container, {backgroundColor: colors.background}]}
                ref={containerRef}>
                {loading ? (
                    <LoadingAnimation onFinished={() => setLoading(false)} />
                ) : (
                    <>
                        <NavBar toggleDropdown={toggleDropdown} dropdownVisible={dropdownVisible} />
                        <SectionList
                            sections={groupedContacts}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({item}) => (
                                <ContactCard
                                    contact={item}
                                    darkMode={darkMode}
                                    onDelete={deleteContact}
                                />
                            )}
                            renderSectionHeader={({section: {title}}) => (
                                <Text
                                    style={[
                                        styles.sectionHeader,
                                        {backgroundColor: colors.background, color: colors.text},
                                    ]}>
                                    {title}
                                </Text>
                            )}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                            stickySectionHeadersEnabled
                        />
                        <AddFloatingButton
                            buttonColor={darkMode ? colorsDarkMode.link : colorsLightMode.link}
                        />
                    </>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
});

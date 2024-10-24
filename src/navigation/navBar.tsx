import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-element-dropdown';
import i18n from '../i18n'; // Importing the i18n configuration
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsWhiteMode';

const NavBar = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [language, setLanguage] = useState('US'); // Default to English ('US')

    const toggleMenu = () => setShowMenu(!showMenu);
    const toggleDarkMode = () => setDarkMode(!darkMode);
    const toggleSearch = () => setShowSearch(!showSearch);

    // Theme colors based on darkMode state
    const colors = darkMode ? colorsDarkMode : colorsLightMode;

    // Change language function
    const changeLanguage = (lang: string) => {
        setLanguage(lang);
        i18n.changeLanguage(lang === 'US' ? 'en' : 'es'); // Change i18n language
    };

    // Data for the dropdown
    const data = [
        { label: 'ES', value: 'ES' }, // Spanish
        { label: 'US', value: 'US' }, // English
    ];

    return (
        <View style={[styles.navbarContainer, { backgroundColor: colors.navBackground }]}>
            {/* Dropdown Menu - Left */}
            <View style={styles.relative}>
                <TouchableOpacity onPress={toggleMenu}>
                    <FontAwesome name="bars" size={24} color={colors.text} />
                </TouchableOpacity>
                {showMenu && (
                    <View style={[styles.menuContainer, { backgroundColor: colors.secondaryBackground }]}>
                        {/* Dark Mode Toggle */}
                        <TouchableOpacity style={styles.menuItem} onPress={toggleDarkMode}>
                            <FontAwesome
                                name={darkMode ? 'sun-o' : 'moon-o'}
                                size={20}
                                color={colors.text}
                            />
                            <Text style={[styles.menuItemText, { color: colors.text }]}>
                                {darkMode ? i18n.t('lightMode') : i18n.t('darkMode')}
                            </Text>
                        </TouchableOpacity>

                        {/* Language Selector */}
                        <Dropdown
                            style={[styles.dropdown, { backgroundColor: colors.secondaryBackground }]}
                            data={data}
                            labelField="label"
                            valueField="value"
                            value={language}
                            onChange={item => changeLanguage(item.value)}
                            placeholder={i18n.t('selectLanguage')}
                            placeholderStyle={[styles.placeholderStyle, { color: colors.text }]}
                            selectedTextStyle={[styles.selectedTextStyle, { color: colors.text }]}
                            containerStyle={[styles.dropdownContainerStyle, { backgroundColor: colors.secondaryBackground }]}
                        />

                        {/* Help Button */}
                        <TouchableOpacity style={styles.menuItem}>
                            <FontAwesome
                                name="question-circle"
                                size={20}
                                color={colors.text}
                            />
                            <Text style={[styles.menuItemText, { color: colors.text }]}>
                                {i18n.t('help')}
                            </Text>
                        </TouchableOpacity>

                        {/* Settings Button */}
                        <TouchableOpacity style={styles.menuItem}>
                            <FontAwesome name="cog" size={20} color={colors.text} />
                            <Text style={[styles.menuItemText, { color: colors.text }]}>
                                {i18n.t('settings')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* App Name / Search Bar - Center */}
            <View style={styles.center}>
                {showSearch ? (
                    <TextInput
                        style={[styles.searchInput, { backgroundColor: colors.text }]}
                        placeholder={i18n.t('searchPlaceholder')}
                        placeholderTextColor={colors.background}
                        autoFocus={true}
                    />
                ) : (
                    <Text style={[styles.appTitle, { color: colors.text }]}>React Contacts</Text>
                )}
            </View>

            {/* Right Side Icons */}
            <View style={styles.rightIcons}>
                {/* Search Icon */}
                <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
                    <FontAwesome name="search" size={24} color={colors.text} />
                </TouchableOpacity>

                {/* Profile Icon */}
                <View style={styles.profileContainer}>
                    <TouchableOpacity>
                        <FontAwesome name="user-circle" size={25} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.profileName, { color: colors.text }]}>
                        {i18n.t('profileName')}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    navbarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        height: 64,
        width: '100%',
    },
    relative: {
        position: 'relative',
    },
    menuContainer: {
        position: 'absolute',
        width: 150,
        top: 40,
        left: 0,
        padding: 16,
        zIndex: 20,
        borderRadius: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    menuItemText: {
        marginLeft: 8,
    },
    dropdown: {
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginBottom: 15,
    },
    placeholderStyle: {},
    selectedTextStyle: {},
    dropdownContainerStyle: {},
    center: {
        alignItems: 'center',
    },
    searchInput: {
        padding: 8,
        borderRadius: 4,
        width: 256,
    },
    appTitle: {
        fontSize: 20,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginRight: 16,
    },
    profileContainer: {
        alignItems: 'center',
    },
    profileName: {
        textAlign: 'center',
    },
});

export default NavBar;

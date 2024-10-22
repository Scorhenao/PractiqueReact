import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const NavBar = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [language, setLanguage] = useState('ES');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

    const toggleMenu = () => setShowMenu(!showMenu);
    const toggleDarkMode = () => setDarkMode(!darkMode);
    const toggleSearch = () => setShowSearch(!showSearch);

    return (
        <View style={styles.navbarContainer}>
            {/* Dropdown Menu - Left */}
            <View style={styles.relative}>
                <TouchableOpacity onPress={toggleMenu}>
                    <FontAwesome name="bars" size={24} color="white" />
                </TouchableOpacity>
                {showMenu && (
                    <View style={styles.menuContainer}>
                        {/* Dark Mode Toggle */}
                        <TouchableOpacity style={styles.menuItem} onPress={toggleDarkMode}>
                            <FontAwesome name={darkMode ? 'sun-o' : 'moon-o'} size={20} color="white" />
                            <Text style={styles.menuItemText}>
                                {darkMode ? 'Light Mode' : 'Dark Mode'}
                            </Text>
                        </TouchableOpacity>

                        {/* Language Selector */}
                        <TouchableOpacity style={styles.menuItem} onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}>
                            <Text style={styles.menuItemText}>{language}</Text>
                        </TouchableOpacity>
                        {showLanguageDropdown && (
                            <View style={styles.dropdown}>
                                <TouchableOpacity onPress={() => setLanguage('ES')}>
                                    <Text style={styles.dropdownText}>ES</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setLanguage('US')}>
                                    <Text style={styles.dropdownText}>US</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Help Button */}
                        <TouchableOpacity style={styles.menuItem}>
                            <FontAwesome name="question-circle" size={20} color="white" />
                            <Text style={styles.menuItemText}>Help</Text>
                        </TouchableOpacity>

                        {/* Settings Button */}
                        <TouchableOpacity style={styles.menuItem}>
                            <FontAwesome name="cog" size={20} color="white" />
                            <Text style={styles.menuItemText}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* App Name / Search Bar - Center */}
            <View style={styles.center}>
                {showSearch ? (
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        autoFocus={true}
                    />
                ) : (
                    <Text style={styles.appTitle}>React Contacts</Text>
                )}
            </View>

            {/* Right Side Icons */}
            <View style={styles.rightIcons}>
                {/* Search Icon */}
                <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
                    <FontAwesome name="search" size={24} color="white" />
                </TouchableOpacity>

                {/* Profile Icon */}
                <View style={styles.profileContainer}>
                    <TouchableOpacity>
                        <FontAwesome name="user-circle" size={25} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.profileName}>John Doe</Text>
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
        backgroundColor: '#2d2d2d', // Equivalent to bgGray800 in Tailwind
        height: 64,
        width: '100%',
    },
    relative: {
        position: 'relative',
    },
    menuContainer: {
        position: 'absolute',
        width: 100,
        top: 40,
        left: 0,
        backgroundColor: '#3a3a3a', // Equivalent to bgGray700 in Tailwind
        padding: 16,
        zIndex: 20, // zIndex to overlay menu
        borderRadius: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    menuItemText: {
        color: 'white',
        marginLeft: 8,
    },
    dropdown: {
        marginTop: 8,
        backgroundColor: '#4b4b4b', // Equivalent to bgGray600
        padding: 8,
        borderRadius: 4,
    },
    dropdownText: {
        color: 'white',
        paddingVertical: 4,
    },
    center: {
        alignItems: 'center',
    },
    searchInput: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 4,
        width: 256,
    },
    appTitle: {
        color: 'white',
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
        color: 'white',
        textAlign: 'center',
    },
});

export default NavBar;

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import {SearchBar} from 'react-native-elements';
import i18n from '../i18n'; // Importando la configuración de i18n
import colorsDarkMode from '../theme/colorsLightMode';
import colorsLightMode from '../theme/colorsDarkMode';
import {useTheme} from '../context/themeContext'; // Importa el Theme Context
import {useNavigation} from '@react-navigation/native'; // Para la navegación
import DarkModeToggle from './DarkModeToggle'; // Importa el nuevo componente
import {RootStackParamList} from '../screens/types/NavigationTypes';
import {StackNavigationProp} from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const NavBar = () => {
    const [showMenu, setShowMenu] = useState(false);
    const navigation: NavigationProp = useNavigation();
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [language, setLanguage] = useState('US'); // Predeterminado a inglés ('US')

    const {darkMode, setDarkMode} = useTheme(); // Obtén el estado de darkMode

    // Colores según el estado de darkMode
    const colors = darkMode ? colorsDarkMode : colorsLightMode;

    // Función para cambiar el idioma
    const changeLanguage = (lang: string) => {
        setLanguage(lang);
        i18n.changeLanguage(lang === 'US' ? 'en' : 'es'); // Cambia el idioma en i18n
    };

    // Datos para el dropdown
    const data = [
        {label: 'ES', value: 'ES'}, // Español
        {label: 'US', value: 'US'}, // Inglés
    ];

    // Función para cerrar el dropdown al hacer click fuera de él
    const handleCloseMenu = () => {
        setShowMenu(false); // Cerrar el dropdown
    };

    return (
        <TouchableWithoutFeedback onPress={handleCloseMenu}>
            <View style={[styles.navbarContainer, {backgroundColor: colors.navBackground}]}>
                {/* Dropdown Menu - Left */}
                <View style={styles.relative}>
                    <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
                        <FontAwesome name="bars" size={24} color={colors.text} />
                    </TouchableOpacity>
                    {showMenu && (
                        <View
                            style={[
                                styles.menuContainer,
                                {backgroundColor: colors.secondaryBackground},
                            ]}>
                            {/* Dark Mode Toggle */}
                            <DarkModeToggle onPress={() => setDarkMode(!darkMode)} />

                            {/* Language Selector */}
                            <Dropdown
                                style={[
                                    styles.dropdown,
                                    {backgroundColor: colors.secondaryBackground},
                                ]}
                                data={data}
                                labelField="label"
                                valueField="value"
                                value={language}
                                onChange={item => changeLanguage(item.value)}
                                placeholder={i18n.t('selectLanguage')}
                                containerStyle={[
                                    styles.dropdownContainerStyle,
                                    {backgroundColor: colors.secondaryBackground},
                                ]}
                            />

                            {/* Help Button */}
                            <TouchableOpacity style={styles.menuItem}>
                                <FontAwesome name="question-circle" size={20} color={colors.text} />
                                <Text style={[styles.menuItemText, {color: colors.text}]}>
                                    {i18n.t('help')}
                                </Text>
                            </TouchableOpacity>

                            {/* Settings Button */}
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => navigation.navigate('SettingsScreen')}>
                                <FontAwesome name="cog" size={20} color={colors.text} />
                                <Text style={[styles.menuItemText, {color: colors.text}]}>
                                    {i18n.t('settings')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* App Name / Search Bar - Center */}
                <View style={styles.center}>
                    {showSearch ? (
                        <SearchBar
                            placeholder="Type Here..."
                            onChangeText={text => setSearch(text)} // Directly use the string `text`
                            value={search}
                            containerStyle={[
                                styles.searchContainer,
                                {backgroundColor: colors.text},
                            ]}
                            inputContainerStyle={styles.inputContainer}
                            inputStyle={{color: colors.background}}
                            placeholderTextColor={colors.background}
                        />
                    ) : (
                        <Text style={[styles.appTitle, {color: colors.text}]}>CloseToYou</Text>
                    )}
                </View>

                {/* Right Side Icons */}
                <View style={styles.rightIcons}>
                    {/* Search Icon to toggle SearchBar */}
                    <TouchableOpacity
                        onPress={() => setShowSearch(!showSearch)}
                        style={styles.iconButton}>
                        <FontAwesome name="search" size={24} color={colors.text} />
                    </TouchableOpacity>
                    {/* Profile Icon */}
                    <View style={styles.profileContainer}>
                        <TouchableOpacity>
                            <FontAwesome name="user-circle" size={25} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.profileName, {color: colors.text}]}>
                            {i18n.t('profileName')}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
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
        zIndex: 1,
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
        borderRadius: 8,
        zIndex: 1,
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
    searchContainer: {
        display: 'flex',
        width: 210,
        height: 50,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 20,
        justifyContent: 'center',
    },
    inputContainer: {
        backgroundColor: '#e1e1e1',
        borderRadius: 20,
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

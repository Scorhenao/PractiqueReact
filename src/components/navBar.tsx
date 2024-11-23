import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import {SearchBar} from 'react-native-elements';
import i18n from '../i18n';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import {useTheme} from '../context/themeContext';
import {useNavigation} from '@react-navigation/native';
import DarkModeToggle from './DarkModeToggle';
import {RootStackParamList} from '../screens/types/NavigationTypes';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define las props del NavBar
type NavBarProps = {
    toggleDropdown: () => void;
    dropdownVisible: boolean;
};

const NavBar: React.FC<NavBarProps> = ({toggleDropdown, dropdownVisible}) => {
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [language, setLanguage] = useState('US');
    const [profileName, setProfileName] = useState<string>(''); // Estado para almacenar el nombre del perfil
    const {darkMode, toggleDarkMode} = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    const changeLanguage = (lang: string) => {
        setLanguage(lang);
        i18n.changeLanguage(lang === 'US' ? 'en' : 'es');
    };

    const data = [
        {label: 'ES', value: 'ES'},
        {label: 'US', value: 'US'},
    ];

    const handleCloseMenu = () => {
        toggleDropdown(); // Cierra el menú usando el toggle
    };

    // Use effect para cargar el nombre del perfil desde AsyncStorage
    useEffect(() => {
        const loadProfileName = async () => {
            try {
                const name = await AsyncStorage.getItem('profileName');
                if (name) {
                    setProfileName(name);
                }
            } catch (error) {
                console.error('Error loading profile name from AsyncStorage', error);
            }
        };
        loadProfileName();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={handleCloseMenu}>
            <View style={[styles.navbarContainer, {backgroundColor: colors.navBackground}]}>
                {/* Dropdown Menu - Left */}
                <View style={styles.relative}>
                    <TouchableOpacity onPress={toggleDropdown}>
                        <FontAwesome name="bars" size={24} color={colors.text} />
                    </TouchableOpacity>
                    {dropdownVisible && (
                        <View
                            style={[
                                styles.menuContainer,
                                {backgroundColor: colors.secondaryBackground},
                            ]}>
                            {/* Dark Mode Toggle */}
                            <DarkModeToggle onPress={toggleDarkMode} />

                            {/* Language Selector */}
                            <Dropdown
                                style={[styles.dropdown]}
                                data={data}
                                labelField="label"
                                valueField="value"
                                value={language}
                                onChange={item => changeLanguage(item.value)}
                                placeholder={i18n.t('selectLanguage')}
                                containerStyle={[
                                    styles.dropdownContainerStyle,
                                    {backgroundColor: colors.background, borderColor: colors.text},
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
                            placeholder={i18n.t('searchPlaceholder')}
                            onChangeText={setSearch}
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
                            {profileName || i18n.t('profileName')}{' '}
                            {/* Mostrar el nombre del perfil desde AsyncStorage */}
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

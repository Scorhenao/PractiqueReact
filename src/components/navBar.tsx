import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
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
import {styles} from '../screens/styles/navBar.styles';
import useSearchContacts from '../hooks/useSearchContacts';

type NavBarProps = {
    toggleDropdown: () => void;
    dropdownVisible: boolean;
};

const NavBar: React.FC<NavBarProps> = ({toggleDropdown, dropdownVisible}) => {
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [language, setLanguage] = useState('US');
    const [profileName, setProfileName] = useState<string>('');
    const {darkMode, toggleDarkMode} = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;
    const {searchContacts} = useSearchContacts();

    const changeLanguage = (lang: string) => {
        setLanguage(lang);
        i18n.changeLanguage(lang === 'US' ? 'en' : 'es');
    };

    const handleSearch = async (text: string) => {
        setSearch(text);
        if (text.length >= 2) {
            await searchContacts(text, 'name');
        }
    };

    const data = [
        {label: 'ES', value: 'ES'},
        {label: 'US', value: 'US'},
    ];

    const handleCloseMenu = () => {
        toggleDropdown();
    };

    useEffect(() => {
        const loadProfileName = async () => {
            try {
                const name = await AsyncStorage.getItem('username');
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
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => navigation.navigate('HelpScreen')}>
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
                            onChangeText={handleSearch}
                            value={search}
                            containerStyle={[
                                styles.searchContainer,
                                {backgroundColor: colors.text},
                            ]}
                            inputContainerStyle={styles.inputContainer}
                            inputStyle={{color: colors.background}}
                            placeholderTextColor={colors.background}
                            platform="default"
                            showCancel
                            onCancel={() => {
                                setShowSearch(false);
                                setSearch('');
                                searchContacts('', 'name'); // Limpia la búsqueda
                            }}
                        />
                    ) : (
                        <Text style={[styles.appTitle, {color: colors.text}]}>CloseToYou</Text>
                    )}
                </View>

                {/* Right Side Icons */}
                <View style={styles.rightIcons}>
                    {/* Search Icon to toggle SearchBar */}
                    <TouchableOpacity
                        onPress={() => {
                            const newShowSearch = !showSearch;
                            setShowSearch(newShowSearch);
                            if (!newShowSearch) {
                                setSearch('');
                                searchContacts('', 'name');
                            }
                        }}
                        style={styles.iconButton}>
                        <FontAwesome
                            name={showSearch ? 'times' : 'search'}
                            size={24}
                            color={colors.text}
                        />
                    </TouchableOpacity>
                    {/* Profile Icon */}
                    <View style={styles.profileContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                            <FontAwesome name="user-circle" size={25} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.profileName, {color: colors.text}]}>
                            {profileName || i18n.t('profileName')}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default NavBar;

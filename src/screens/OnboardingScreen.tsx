import React, {useEffect, useState} from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import {Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colorsLightMode from '../theme/colorsLightMode';
import colorsDarkMode from '../theme/colorsDarkMode';
import {useTheme} from '../theme/themeContext';
import {RootStackParamList} from './types/NavigationTypes';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OnboardingScreen'>;

const OnboardingScreen = () => {
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsDarkMode : colorsLightMode;
    const navigation = useNavigation<OnboardingScreenNavigationProp>();
    // const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

    // useEffect(() => {
    //     const checkFirstLaunch = async () => {
    //         try {
    //             const hasLaunched = await AsyncStorage.getItem('hasLaunched');
    //             if (hasLaunched === null) {
    //                 setIsFirstLaunch(true);
    //                 await AsyncStorage.setItem('hasLaunched', 'true');
    //             } else {
    //                 setIsFirstLaunch(false);
    //             }
    //         } catch (error) {
    //             console.error('Error checking first launch:', error);
    //         }
    //     };
    //     checkFirstLaunch();
    // }, []);

    // useEffect(() => {
    //     if (isFirstLaunch === false) {
    //         // Si no es la primera vez, navega directamente a la pantalla de registro después de renderizar
    //         navigation.replace('Register');
    //     }
    // }, [isFirstLaunch, navigation]);

    // if (isFirstLaunch === null) {
    //     // Muestra una pantalla de carga o retorna null mientras verifica
    //     return null;
    // }

    // if (!isFirstLaunch) {
    //     // Si no es la primera vez, no renderiza el componente de OnboardingScreen
    //     return null;
    // }

    return (
        <Onboarding
            onSkip={() => navigation.replace('Register')}
            onDone={() => navigation.replace('Register')}
            pages={[
                {
                    backgroundColor: colors.background,
                    image: (
                        <Image
                            source={require('../assets/imgs/tutorial/step-1-addContact.png')}
                            style={styles.image}
                        />
                    ),
                    title: 'Add a Contact',
                    subtitle: 'Tap the "+" icon to add a new contact to your list.',
                },
                {
                    backgroundColor: colors.background,
                    image: (
                        <Image
                            source={require('../assets/imgs/tutorial/step-2-addContact.png')}
                            style={styles.image}
                        />
                    ),
                    title: 'View Contacts',
                    subtitle: 'See your saved contacts. Pull down to refresh the list if needed.',
                },
                {
                    backgroundColor: colors.background,
                    image: (
                        <Image
                            source={require('../assets/imgs/tutorial/step-3-editContact.png')}
                            style={styles.image}
                        />
                    ),
                    title: 'Contact Options',
                    subtitle:
                        'Tap and hold a contact or use the menu to edit, view more, or delete.',
                },
                {
                    backgroundColor: colors.background,
                    image: (
                        <Image
                            source={require('../assets/imgs/tutorial/step-4-seeMoreContact.png')}
                            style={styles.image}
                        />
                    ),
                    title: 'Main Menu',
                    subtitle:
                        'Access settings, theme options, language preferences, and help from the main menu.',
                },
                {
                    backgroundColor: colors.background,
                    image: (
                        <Image
                            source={require('../assets/imgs/tutorial/step-5-deleteContact.png')}
                            style={styles.image}
                        />
                    ),
                    title: 'Add Contact Details',
                    subtitle:
                        'Enter name, phone, email, and type (Employee or Client) in the fields provided.',
                },
                {
                    backgroundColor: colors.background,
                    image: (
                        <Image
                            source={require('../assets/imgs/tutorial/step-6-navDropdown.png')}
                        />
                    ),
                    title: 'Dropdown Options',
                    subtitle:
                        'Change theme, language, access help, or sync contacts from the dropdown menu.',
                },
                {
                    backgroundColor: colors.background,
                    image: (
                        <Image
                            source={require('../assets/imgs/tutorial/step-7-navDropdown.png')}
                        />
                    ),
                    title: 'Theme Toggle',
                    subtitle:
                        'Press the theme icon to switch between light and dark modes, showing a sun or moon icon.',
                },
                {
                    backgroundColor: colors.background,
                    image: (
                        <Image
                            source={require('../assets/imgs/tutorial/step-8-navDropdown.png')}
                        />
                    ),
                    title: 'Language Selection',
                    subtitle:
                        'Select the highlighted language option (ES for Spanish or US for English) to change the app language.',
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 280,
        height: 580,
        padding: 100,
        borderRadius: 10,
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default OnboardingScreen;

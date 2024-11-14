import React, {useEffect, useState} from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import {Image} from 'react-native';
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
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

    useEffect(() => {
        const checkFirstLaunch = async () => {
            try {
                const hasLaunched = await AsyncStorage.getItem('hasLaunched');
                if (hasLaunched === null) {
                    setIsFirstLaunch(true);
                    await AsyncStorage.setItem('hasLaunched', 'true');
                } else {
                    setIsFirstLaunch(false);
                }
            } catch (error) {
                console.error('Error checking first launch:', error);
            }
        };
        checkFirstLaunch();
    }, []);

    useEffect(() => {
        if (isFirstLaunch === false) {
            // Si no es la primera vez, navega directamente a la pantalla de registro después de renderizar
            navigation.replace('Register');
        }
    }, [isFirstLaunch, navigation]);

    if (isFirstLaunch === null) {
        // Muestra una pantalla de carga o retorna null mientras verifica
        return null;
    }

    if (!isFirstLaunch) {
        // Si no es la primera vez, no renderiza el componente de OnboardingScreen
        return null;
    }

    return (
        <Onboarding
            onSkip={() => navigation.replace('Register')}
            onDone={() => navigation.replace('Register')}
            pages={[
                {
                    backgroundColor: colors.background,
                    image: (
                        <Image source={require('../assets/imgs/tutorial/step-1-addContact.png')} />
                    ),
                    title: 'Welcome',
                    subtitle: 'Manage your contacts efficiently and effortlessly',
                },
                {
                    backgroundColor: colors.background,
                    image: (
                        <Image source={require('../assets/imgs/tutorial/step-1-addContact.png')} />
                    ),
                    title: 'Add Contacts',
                    subtitle:
                        'Easily add and organize contacts with detailed information and pictures',
                },
                {
                    backgroundColor: colors.background,
                    image: (
                        <Image source={require('../assets/imgs/tutorial/step-1-addContact.png')} />
                    ),
                    title: 'Select Location',
                    subtitle: 'Save contact locations and view weather updates in each location',
                },
                {
                    backgroundColor: colors.background,
                    image: (
                        <Image source={require('../assets/imgs/tutorial/step-1-addContact.png')} />
                    ),
                    title: 'Filter and Search',
                    subtitle: 'Quickly find any contact with advanced filtering options',
                },
            ]}
        />
    );
};

export default OnboardingScreen;

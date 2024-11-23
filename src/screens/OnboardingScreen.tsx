import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import {Image, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import colorsLightMode from '../theme/colorsLightMode';
import colorsDarkMode from '../theme/colorsDarkMode';
import {useTheme} from '../context/themeContext';
import {RootStackParamList} from './types/NavigationTypes';
import DarkModeToggle from '../components/DarkModeToggle';
import authService from '../services/authService';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const OnboardingScreen = () => {
    const {darkMode, toggleDarkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;
    const navigation = useNavigation<OnboardingScreenNavigationProp>();

    const completeOnboarding = async () => {
        try {
            await authService.setOnboardingStatus(true);
            const status = await authService.getOnboardingStatus();
            console.log('Onboarding Status after completion:', status); // Asegúrate de que el estado se guarda correctamente
            navigation.replace('HomeScreen');
        } catch (error) {
            console.error('Error completing onboarding:', error);
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            {/* Botón de alternancia de modo oscuro */}
            <View style={styles.toggleContainer}>
                <DarkModeToggle onPress={toggleDarkMode} />
            </View>
            <Onboarding
                onSkip={completeOnboarding}
                onDone={completeOnboarding}
                pages={[
                    {
                        backgroundColor: colors.background,
                        image: (
                            <Image
                                source={require('../assets/imgs/onboarding/img-1-onboarding.png')}
                                style={styles.image}
                            />
                        ),
                        title: 'Save Contacts Easily',
                        subtitle:
                            'Store contacts with location, image, phone number, and email on a secure server.',
                    },
                    {
                        backgroundColor: colors.background,
                        image: <Image style={styles.image} />,
                        title: 'Dark Mode',
                        subtitle: 'Switch between light and dark modes for comfortable viewing.',
                    },
                    // Puedes añadir más páginas si es necesario...
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    toggleContainer: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    image: {
        width: 380,
        height: 380,
        borderRadius: 10,
        resizeMode: 'contain',
    },
});

export default OnboardingScreen;

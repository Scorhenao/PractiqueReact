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

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const OnboardingScreen = () => {
    const {darkMode, toggleDarkMode} = useTheme();
    const colors = darkMode ? colorsDarkMode : colorsLightMode;
    const navigation = useNavigation<OnboardingScreenNavigationProp>();

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            {/* Botón de alternancia de modo oscuro */}
            <View style={styles.toggleContainer}>
                <DarkModeToggle onPress={toggleDarkMode} />
            </View>
            <Onboarding
                onSkip={() => navigation.replace('HomeScreen')}
                onDone={() => navigation.replace('HomeScreen')}
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
                        image: (
                            <Image
                                // source={require('../assets/imgs/tutorial/step-2-darkmode.png')}
                                style={styles.image}
                            />
                        ),
                        title: 'Dark Mode',
                        subtitle: 'Switch between light and dark modes for comfortable viewing.',
                    },
                    // Más páginas...
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

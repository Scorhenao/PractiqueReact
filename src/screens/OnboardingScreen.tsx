import React, {useEffect, useState} from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import {Image, StyleSheet, View, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import colorsLightMode from '../theme/colorsLightMode';
import colorsDarkMode from '../theme/colorsDarkMode';
import {useTheme} from '../context/themeContext';
import {RootStackParamList} from './types/NavigationTypes';
import DarkModeToggle from '../components/DarkModeToggle';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const OnboardingScreen = () => {
    const {darkMode, toggleDarkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;
    const navigation = useNavigation<OnboardingScreenNavigationProp>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
                if (hasCompletedOnboarding === 'true') {
                    // Si ya completó el onboarding, redirige al HomeScreen
                    navigation.replace('HomeScreen');
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
                setLoading(false);
            }
        };

        checkOnboardingStatus();
    }, [navigation]);

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
            navigation.replace('HomeScreen');
        } catch (error) {
            console.error('Error saving onboarding status:', error);
        }
    };

    if (loading) {
        // Muestra un indicador de carga mientras verificas el estado
        return (
            <View style={[styles.loadingContainer, {backgroundColor: colors.background}]}>
                <ActivityIndicator size="large" color={colors.text} />
            </View>
        );
    }

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
                        image: (
                            <Image
                                source={require('../assets/imgs/onboarding/img-2-onboarding.png')}
                                style={styles.image}
                            />
                        ),
                        title: 'Dark Mode',
                        subtitle: 'Switch between light and dark modes for comfortable viewing.',
                    },
                    {
                        backgroundColor: colors.background,
                        image: (
                            <Image
                                source={require('../assets/imgs/onboarding/img-3-onboarding.png')}
                                style={styles.image}
                            />
                        ),
                        title: 'Fast and Secure',
                        subtitle: 'Access your contacts quickly with our user-friendly interface.',
                    },
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
        width: 300,
        height: 300,
        borderRadius: 10,
        resizeMode: 'contain',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default OnboardingScreen;

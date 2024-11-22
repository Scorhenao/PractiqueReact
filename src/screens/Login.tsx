import React, {useState} from 'react';
import {TextInput, Button, StyleSheet, Alert} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/themeContext';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './types/NavigationTypes';
import authService from '../services/authService'; // Import authService
import axios from 'axios'; // Axios for making API requests

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
    const {t} = useTranslation();
    const navigation: NavigationProp = useNavigation();
    const {darkMode} = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    // Animation values
    const titleOpacity = useSharedValue(0);
    const inputOpacity = useSharedValue(0);
    const backgroundColor = useSharedValue(colors.background);

    React.useEffect(() => {
        // Trigger animations on mount
        titleOpacity.value = withTiming(2, {duration: 2000, easing: Easing.out(Easing.exp)});
        inputOpacity.value = withTiming(1, {duration: 1000, easing: Easing.out(Easing.exp)});
    }, [inputOpacity, titleOpacity, backgroundColor]);

    const animatedTitleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{translateY: titleOpacity.value * -10}],
    }));

    const animatedInputStyle = useAnimatedStyle(() => ({
        opacity: inputOpacity.value,
    }));

    const animatedContainerStyle = useAnimatedStyle(() => ({
        backgroundColor: backgroundColor.value,
    }));

    // Handle login request
    const handleLogin = async () => {
        try {
            // Flash effect on submission
            backgroundColor.value = withTiming(
                colors.link,
                {duration: 100},
                () => (backgroundColor.value = withTiming(colors.background, {duration: 400})),
            );

            // API request for login
            const response = await axios.post(
                'https://close-to-you-backend.onrender.com/api/auth/login',
                {
                    email,
                    password,
                },
            );

            if (response.status === 201 && response.data.accessToken) {
                // Save token on successful login
                await authService.setToken(response.data.accessToken);
                console.log('Token saved:', response.data.accessToken);

                // Navigate to the main screen
                navigation.navigate('AppContainer');
            } else {
                Alert.alert(t('error'), t('invalidCredentials'));
            }
        } catch (error) {
            console.error('Login failed:', error);
            Alert.alert(t('error'), t('loginFailed'));
        }
    };

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
            <Animated.Text style={[styles.title, animatedTitleStyle, {color: colors.text}]}>
                {t('Sign-in to CloseToYou')}
            </Animated.Text>

            <Animated.View style={animatedInputStyle}>
                <TextInput
                    style={[styles.input, {color: colors.text, borderColor: colors.text}]}
                    placeholder={t('emailPlaceholder')}
                    placeholderTextColor={colors.placeholder}
                    secureTextEntry
                    value={email}
                    onChangeText={setEmail}
                    textContentType="emailAddress"
                />
                <TextInput
                    style={[styles.input, {color: colors.text, borderColor: colors.text}]}
                    placeholder={t('passwordPlaceholder')}
                    placeholderTextColor={colors.placeholder}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    textContentType="password"
                />
            </Animated.View>

            <Button title={t('save')} onPress={handleLogin} color={colors.link} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
});

export default LoginScreen;

import React, {useState} from 'react';
import {TextInput, Button, TouchableOpacity} from 'react-native';
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
import {notify} from '../components/NotificationManager';
import {BaseUrl, LoginUrl} from '../utils/routhes';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {styles} from './styles/LoginContact.styles';

type NavigationProp = StackNavigationProp<RootStackParamList >;

const LoginScreen = () => {
    const {t} = useTranslation();
    const navigation: NavigationProp = useNavigation();
    const {darkMode} = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    const titleOpacity = useSharedValue(0);
    const inputOpacity = useSharedValue(0);
    const backgroundColor = useSharedValue(colors.background);

    React.useEffect(() => {
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

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                `${BaseUrl}${LoginUrl}`,
                {email, password},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (response.status === 201 && response.data.accessToken) {
                // Guardar el token
                await authService.setToken(response.data.accessToken);

                // Obtener el ID de usuario
                const userId = await authService.getUserIdFromToken();
                console.log(`Decoded userId: ${userId}`); // Loguear el ID para depuración

                if (userId) {
                    const userName = await authService.getUserNameById(userId);
                    if (userName) {
                        console.log(`Fetched username: ${userName}`);
                        await authService.setUsername(userName);
                    } else {
                        console.warn('Failed to fetch username for user ID:', userId);
                    }
                }

                navigation.navigate('AppContainer');
            } else {
                notify('danger', 'error', 'Invalid credentials');
            }
        } catch (error: any) {
            console.error('Login failed:', error.message);
            notify('warning', 'error', 'Login failed');
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
                    value={email}
                    onChangeText={setEmail}
                    textContentType="emailAddress"
                />

                <TextInput
                    style={[styles.input, {color: colors.text, borderColor: colors.text}]}
                    placeholder={t('passwordPlaceholder')}
                    placeholderTextColor={colors.placeholder}
                    secureTextEntry={!showPassword} // Alterna la visibilidad
                    value={password}
                    onChangeText={setPassword}
                    textContentType="password"
                />

                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}>
                    <FontAwesome
                        name={showPassword ? 'eye' : 'eye-slash'} // Cambia el ícono según el estado
                        size={20}
                        color={colors.placeholder}
                    />
                </TouchableOpacity>
            </Animated.View>

            <Button title={t('save')} onPress={handleLogin} color={colors.link} />
        </Animated.View>
    );
};

export default LoginScreen;

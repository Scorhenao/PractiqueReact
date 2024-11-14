import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import {useTheme} from '../theme/themeContext';
import colorsLightMode from '../theme/colorsLightMode';
import colorsDarkMode from '../theme/colorsDarkMode';
import {useTranslation} from 'react-i18next';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const RegisterScreen = () => {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    const animatedContainerStyle = useAnimatedStyle(() => ({
        backgroundColor: backgroundColor.value,
    }));
    const handleRegister = () => {
        // Trigger a flash effect on submission
        backgroundColor.value = withTiming(
            colors.link,
            {duration: 100},
            () => (backgroundColor.value = withTiming(colors.background, {duration: 400})),
        );

        // Navigate to AppContainer after a short delay
        setTimeout(() => {
            navigation.navigate('Login'); // Ensure the transition happens after animation
        }, 500);
    };
    return (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
            <Animated.Text style={[styles.title, animatedTitleStyle, {color: colors.text}]}>
                {t('Sign-up to CloseToYou')}
            </Animated.Text>
            <TextInput
                style={[styles.input, {color: colors.text, borderColor: colors.text}]}
                placeholder={t('namePlaceholder')}
                placeholderTextColor={colors.placeholder}
                value={username}
                onChangeText={setUsername}
                textContentType="name"
            />
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
            <TouchableOpacity
                style={[styles.button, {backgroundColor: colors.link}]}
                onPress={handleRegister}>
                <Text style={[{color: colors.text}]}>{t('register')}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    button: {
        height: 40,
        width: '100%',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RegisterScreen;

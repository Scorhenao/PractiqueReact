import React, {useState} from 'react';
import {TextInput, Button, StyleSheet} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../theme/themeContext';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';

const LoginScreen = () => {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const {darkMode} = useTheme();
    const [username, setUsername] = useState('');
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

    const handleRegister = () => {
        // Trigger a flash effect on submission
        backgroundColor.value = withTiming(
            colors.link,
            {duration: 100},
            () => (backgroundColor.value = withTiming(colors.background, {duration: 400})),
        );

        // Navigate to AppContainer after a short delay
        setTimeout(() => {
            navigation.navigate('AppContainer'); // Ensure the transition happens after animation
        }, 500);
    };

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
            <Animated.Text style={[styles.title, animatedTitleStyle, {color: colors.text}]}>
                {t('Sign-in to CloseToYou')}
            </Animated.Text>

            <Animated.View style={animatedInputStyle}>
                <TextInput
                    style={[styles.input, {color: colors.text, borderColor: colors.text}]}
                    placeholder={t('namePlaceholder')}
                    placeholderTextColor={colors.placeholder}
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={[styles.input, {color: colors.text, borderColor: colors.text}]}
                    placeholder={t('emailPlaceholder')}
                    placeholderTextColor={colors.placeholder}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </Animated.View>

            <Button title={t('save')} onPress={handleRegister} color={colors.link} />
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
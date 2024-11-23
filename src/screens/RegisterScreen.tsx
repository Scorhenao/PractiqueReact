import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    View,
} from 'react-native';
import {useTheme} from '../context/themeContext';
import colorsLightMode from '../theme/colorsLightMode';
import colorsDarkMode from '../theme/colorsDarkMode';
import {useTranslation} from 'react-i18next';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './types/NavigationTypes';
import {useRegister} from '../hooks/useRegister';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const RegisterScreen = () => {
    const {t} = useTranslation();
    const navigation: NavigationProp = useNavigation();
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;
    const [name, setname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {register, loading} = useRegister();

    // Animation values
    const titleOpacity = useSharedValue(0);
    const inputOpacity = useSharedValue(0);
    const backgroundColor = useSharedValue(colors.background);

    React.useEffect(() => {
        titleOpacity.value = withTiming(1, {duration: 2000, easing: Easing.out(Easing.exp)});
        inputOpacity.value = withTiming(1, {duration: 1000, easing: Easing.out(Easing.exp)});
    }, [inputOpacity, titleOpacity, backgroundColor]);

    const animatedTitleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{translateY: titleOpacity.value * -10}],
    }));

    const animatedContainerStyle = useAnimatedStyle(() => ({
        backgroundColor: backgroundColor.value,
    }));

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', t('Please fill all fields'));
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', t('Passwords do not match'));
            return;
        }

        const data = {
            name: name,
            email: email,
            password: password,
        };

        const result = await register(data);

        if (result.success) {
            navigation.navigate('Login'); // Navigate to login screen
        }
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
                value={name}
                onChangeText={setname}
                textContentType="name"
            />
            <TextInput
                style={[styles.input, {color: colors.text, borderColor: colors.text}]}
                placeholder={t('emailPlaceholder')}
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={setEmail}
                textContentType="emailAddress"
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, {color: colors.text, borderColor: colors.text}]}
                    placeholder={t('passwordPlaceholder')}
                    placeholderTextColor={colors.placeholder}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    textContentType="password"
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}>
                    <FontAwesome
                        name={showPassword ? 'eye' : 'eye-slash'}
                        size={20}
                        color={colors.placeholder}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, {color: colors.text, borderColor: colors.text}]}
                    placeholder={t('confirmPasswordPlaceholder')}
                    placeholderTextColor={colors.placeholder}
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    textContentType="password"
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <FontAwesome
                        name={showConfirmPassword ? 'eye' : 'eye-slash'}
                        size={20}
                        color={colors.placeholder}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.button, {backgroundColor: colors.link}]}
                onPress={handleRegister}
                disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color={colors.text} />
                ) : (
                    <Text style={[{color: colors.text}]}>{t('Register')}</Text>
                )}
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
    inputContainer: {
        position: 'relative',
        width: '100%',
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
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 8,
    },
});

export default RegisterScreen;

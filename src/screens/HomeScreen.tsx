import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import {useTheme} from '../context/themeContext';

const HomeScreen = ({navigation}: any) => {
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    return (
        <View style={[styles.supContainer, {backgroundColor: colors.background}]}>
            <View style={[styles.container]}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
                <Text style={[{color: colors.text}]}>¡Welcome to Close to you! </Text>
                <Text style={styles.subText}>Manage your contacts and keep them updated.</Text>

                <TouchableOpacity
                    style={[styles.button, {backgroundColor: colors.link}]}
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.buttonText, {color: colors.text}]}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, {backgroundColor: colors.link}]}
                    onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    supContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center', // Centramos verticalmente
        alignItems: 'center',
        paddingHorizontal: 20, // Añadir espacio lateral
        paddingTop: 20, // Evitar que el contenido se solape con el NavBar
    },
    logo: {
        width: 300,
        height: 200,
        marginBottom: 20,
        borderRadius: 8,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        width: '80%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;

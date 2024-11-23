import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Animated, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack'; // Importar StackNavigationProp
import {RootStackParamList} from './types/NavigationTypes'; // Asegúrate de tener esto
import { checkToken } from '../utils/authUtils';

// Definir el tipo de navegación correcto
type NavigationProps = StackNavigationProp<RootStackParamList, 'LoadingScreen'>;

const LoadingScreen = () => {
    const rotateValue = useRef(new Animated.Value(0)).current;
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NavigationProps>(); // Usar el tipo correcto

    useEffect(() => {
        // Crear la animación de rotación infinita
        Animated.loop(
            Animated.timing(rotateValue, {
                toValue: 1, // Gira 360 grados
                duration: 1500, // Duración de un giro (1.5 segundos)
                useNativeDriver: true, // Usamos el driver nativo para rendimiento
            }),
        ).start();

        const verifyToken = async () => {
            const isAuthenticated = await checkToken(); // Verifica si el token existe
            setLoading(false); // Dejar de mostrar el indicador de carga

            if (isAuthenticated) {
                // Si el token existe, redirigir al AppContainer
                navigation.replace('AppContainer'); // Usamos replace para que no pueda volver a la pantalla de Loading
            } else {
                // Si no hay token, redirigir al Login
                navigation.replace('Login');
            }
        };

        verifyToken(); // Ejecutar la verificación del token
    }, [navigation, rotateValue]);

    // Interpolamos el valor de rotación
    const rotate = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'], // Rota de 0 a 360 grados
    });

    return (
        <View style={styles.container}>
            {loading ? (
                <Animated.View
                    style={{
                        transform: [{rotate}], // Aplicar la animación de rotación
                    }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </Animated.View>
            ) : (
                <Text>Redirecting...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingScreen;

import React, {createContext, useState, useContext, ReactNode} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

// Definir el tipo de datos que manejará el contexto
interface LocationContextType {
    location: {
        latitude: number;
        longitude: number;
    } | null;
    getLocation: () => void;
    hasPermission: boolean;
    darkMode: boolean;
    toggleDarkMode: () => void;
}

// Crear el contexto
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Crear un Provider para el contexto
interface LocationProviderProps {
    children: ReactNode;
}

export const LocationProvider = ({children}: LocationProviderProps) => {
    const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [darkMode, setDarkMode] = useState(false); // Estado del modo oscuro

    // Función para alternar el modo oscuro
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Función para obtener la ubicación del usuario
    const getLocation = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                setHasPermission(false);
                Alert.alert(
                    'Permission Denied',
                    'Location permission is required to use this feature.',
                );
            }

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setHasPermission(true);
                Geolocation.getCurrentPosition(
                    info => {
                        setLocation({
                            latitude: info.coords.latitude,
                            longitude: info.coords.longitude,
                        });
                    },
                    error => {
                        console.error(error);
                    },
                );
            } else {
                setHasPermission(false);
            }
        } else {
            Geolocation.getCurrentPosition(
                info => {
                    setLocation({
                        latitude: info.coords.latitude,
                        longitude: info.coords.longitude,
                    });
                },
                error => {
                    console.error(error);
                },
            );
        }
    };

    return (
        <LocationContext.Provider
            value={{
                location,
                getLocation,
                hasPermission,
                darkMode,
                toggleDarkMode,
            }}>
            {children}
        </LocationContext.Provider>
    );
};

// Hook para acceder al contexto en cualquier componente
export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};

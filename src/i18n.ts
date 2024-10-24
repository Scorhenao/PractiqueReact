import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define translations for each language
const resources = {
    en: {
        translation: {
            welcome: 'Welcome to React Contacts',
            darkMode: 'Dark Mode',
            lightMode: 'Light Mode',
            help: 'Help',
            settings: 'Settings',
            selectLanguage: 'Select language',
            profileName: 'John Doe',
            searchPlaceholder: 'Search...',
        },
    },
    es: {
        translation: {
            welcome: 'Bienvenido a React Contacts',
            darkMode: 'Modo Oscuro',
            lightMode: 'Modo Claro',
            help: 'Ayuda',
            settings: 'Configuraciones',
            selectLanguage: 'Selecciona idioma',
            profileName: 'Juan Pérez',
            searchPlaceholder: 'Buscar...',
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // React already escapes by default
    },
    // Store the selected language in AsyncStorage
    backend: {
        loadPath: () => AsyncStorage.getItem('language'),
        savePath: (language: string) => AsyncStorage.setItem('language', language),
    },
});

export default i18n;

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
            namePlaceholder: 'Name',
            phonePlaceholder: 'Phone',
            emailPlaceholder: 'Email',
            employee: 'Employee',
            client: 'Client',
            errorMessage: 'Please fill all fields before saving.',
            successMessage: 'Contact added successfully!',
            viewMore: 'View More',
            edit: 'Edit',
            delete: 'Delete',
            close: 'Close',
            role: 'Role',
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
            namePlaceholder: 'Nombre',
            phonePlaceholder: 'Teléfono',
            emailPlaceholder: 'Correo Electrónico',
            employee: 'Empleado',
            client: 'Cliente',
            errorMessage: 'Por favor, complete todos los campos antes de guardar.',
            successMessage: '¡Contacto agregado exitosamente!',
            viewMore: 'Ver Más',
            edit: 'Editar',
            delete: 'Eliminar',
            close: 'Cerrar',
            role: 'Rol',
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
    backend: {
        loadPath: () => AsyncStorage.getItem('language'),
        savePath: (language: string) => AsyncStorage.setItem('language', language),
    },
});

export default i18n;

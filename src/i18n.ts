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
            namePlaceholder: 'Name: ',
            phonePlaceholder: 'Phone: ',
            emailPlaceholder: 'Email: ',
            passwordPlaceholder: 'Password: ',
            confirmPasswordPlaceholder: 'Confirm your password: ',
            employee: 'Employee',
            client: 'Client',
            errorMessage: 'Please fill all fields before saving.',
            successMessage: 'Contact added successfully!',
            contactUpdatedSuccessfully: 'Contact updated successfully!',
            viewMore: 'View More',
            edit: 'Edit',
            delete: 'Delete',
            close: 'Close',
            role: 'Role',
            save: 'save',
            NoImageSelected: '¡No Image Selected!',
            selectLocation: 'Select Location',
            noWeather: 'Select a location to see the weather',
            chooseImage: 'Choose Image',
            takePicture: 'Take Picture',
            FailedToSyncContacts: 'Failed to sync contacts. Try again...',
            syncContacts: 'Sync Contacts',
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
            namePlaceholder: 'Nombre: ',
            phonePlaceholder: 'Teléfono: ',
            emailPlaceholder: 'Correo Electrónico: ',
            passwordPlaceholder: 'Contraseña: ',
            confirmPasswordPlaceholder: 'Confirma tu contraseña: ',
            employee: 'Empleado',
            client: 'Cliente',
            errorMessage: 'Por favor, complete todos los campos antes de guardar.',
            successMessage: '¡Contacto agregado exitosamente!',
            contactUpdatedSuccessfully: '¡Contacto actualizado exitosamente!',
            viewMore: 'Ver Más',
            edit: 'Editar',
            delete: 'Eliminar',
            close: 'Cerrar',
            role: 'Rol',
            save: 'Guardar',
            NoImageSelected: '¡No se ha seleccionado ninguna imagen!',
            selectLocation: 'Seleccionar Ubicación',
            noWeather: 'Selecciona una ubicación para ver el clima',
            chooseImage: 'Seleccionar Imagen',
            takePicture: 'Tomar Foto',
            FailedToSyncContacts: 'No se pudieron sincronizar los contactos. Intenta denuevo...',
            syncContacts: 'Sincronizar Contactos',
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

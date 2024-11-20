import React from 'react';
import FlashMessage, {showMessage} from 'react-native-flash-message';

const NotificationManager = () => {
    return <FlashMessage position="top" />;
};

// Función para mostrar mensajes
export const notify = (
    type: 'success' | 'danger' | 'warning' | 'info',
    message: string,
    description?: string,
) => {
    showMessage({
        message,
        description,
        type,
        icon: type, // we need to pass the icon as a prop
        duration: 3000, // the time is in miliseconds
    });
};

export default NotificationManager;

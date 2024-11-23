import React from 'react';
import FlashMessage, {showMessage} from 'react-native-flash-message';

const NotificationManager = () => {
    return <FlashMessage position="top" />;
};

export const notify = (
    type: 'success' | 'danger' | 'warning' | 'info',
    message: string,
    description?: string,
) => {
    showMessage({
        message,
        description,
        type,
        icon: type,
        duration: 3000,
    });
};

export default NotificationManager;

import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

const HelpScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Close to You</Text>
            <Text style={styles.description}>
                Close to You allows you to easily manage your contacts, storing them on a server
                with information like location, images, name, phone number, email, and more. It's
                simple, fast, and intuitive to use.
            </Text>
            <Text style={styles.featureTitle}>Key Features:</Text>
            <Text style={styles.feature}>- Add contacts with location and image</Text>
            <Text style={styles.feature}>- Manage your contacts efficiently</Text>
            <Text style={styles.feature}>
                - Dark mode and language translation (English/Spanish)
            </Text>
            <Text style={styles.feature}>- Pagination for easy navigation</Text>
            <Button
                title="Start Using"
                onPress={() => {
                    /* Navigate to Home Screen */
                }}
            />
        </View>
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
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 30,
    },
    feature: {
        fontSize: 16,
        marginTop: 10,
    },
});

export default HelpScreen;

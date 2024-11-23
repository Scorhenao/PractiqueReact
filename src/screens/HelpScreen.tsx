import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import {useTheme} from '../context/themeContext';

// Importar las imágenes del tutorial
import step1 from '../assets/imgs/tutorial/step-1-addContact.png';
import step2 from '../assets/imgs/tutorial/step-2-addContact.png';
import step3 from '../assets/imgs/tutorial/step-3-editContact.png';
import step4 from '../assets/imgs/tutorial/step-4-seeMoreContact.png';
import step5 from '../assets/imgs/tutorial/step-5-deleteContact.png';
import step6 from '../assets/imgs/tutorial/step-6-navDropdown.png';
import step7 from '../assets/imgs/tutorial/step-7-navDropdown.png';
import step8 from '../assets/imgs/tutorial/step-8-navDropdown.png';

const HelpScreen = () => {
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    return (
        <ScrollView style={[styles.container, {backgroundColor: colors.background}]}>
            <Text style={[styles.title, {color: colors.text}]}>Welcome to Close to You</Text>
            <Text style={[styles.description, {color: colors.text}]}>
                Close to You allows you to easily manage your contacts, storing them on a server
                with information like location, images, name, phone number, email, and more. It's
                simple, fast, and intuitive to use.
            </Text>

            <Text style={[styles.featureTitle, {color: colors.link}]}>Tutorial</Text>

            <View style={styles.tutorialStep}>
                <Image source={step1} style={styles.image} />
                <Text style={[styles.stepText, {color: colors.text}]}>Step 1: Add a contact.</Text>
            </View>

            <View style={styles.tutorialStep}>
                <Image source={step2} style={styles.image} />
                <Text style={[styles.stepText, {color: colors.text}]}>
                    Step 2: Fill in the contact details.
                </Text>
            </View>

            <View style={styles.tutorialStep}>
                <Image source={step3} style={styles.image} />
                <Text style={[styles.stepText, {color: colors.text}]}>
                    Step 3: Edit an existing contact.
                </Text>
            </View>

            <View style={styles.tutorialStep}>
                <Image source={step4} style={styles.image} />
                <Text style={[styles.stepText, {color: colors.text}]}>
                    Step 4: View more details about a contact.
                </Text>
            </View>

            <View style={styles.tutorialStep}>
                <Image source={step5} style={styles.image} />
                <Text style={[styles.stepText, {color: colors.text}]}>
                    Step 5: Delete a contact.
                </Text>
            </View>

            <View style={styles.tutorialStep}>
                <Image source={step6} style={styles.image} />
                <Text style={[styles.stepText, {color: colors.text}]}>
                    Step 6: Navigate through the dropdown menu.
                </Text>
            </View>

            <View style={styles.tutorialStep}>
                <Image source={step7} style={styles.image} />
                <Text style={[styles.stepText, {color: colors.text}]}>
                    Step 7: Access additional features.
                </Text>
            </View>

            <View style={styles.tutorialStep}>
                <Image source={step8} style={styles.image} />
                <Text style={[styles.stepText, {color: colors.text}]}>
                    Step 8: Explore other options.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    tutorialStep: {
        marginBottom: 30,
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 500,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    stepText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default HelpScreen;

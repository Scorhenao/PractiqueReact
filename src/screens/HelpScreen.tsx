import React from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import {useTheme} from '../context/themeContext';
import {styles} from './styles/HelpScreen.styles';
// Datos del tutorial
const tutorialSteps = [
    {
        image: '../assets/imgs/tutorial/step-1-addContact.png',
        text: 'Step 1: Add a contact.',
    },
    {
        image: require('../assets/imgs/tutorial/step-2-addContact.png'),
        text: 'Step 2: Fill in the contact details.',
    },
    {
        image: require('../assets/imgs/tutorial/step-3-editContact.png'),
        text: 'Step 3: Edit an existing contact.',
    },
    {
        image: require('../assets/imgs/tutorial/step-4-seeMoreContact.png'),
        text: 'Step 4: View more details about a contact.',
    },
    {
        image: require('../assets/imgs/tutorial/step-5-deleteContact.png'),
        text: 'Step 5: Delete a contact.',
    },
    {
        image: require('../assets/imgs/tutorial/step-6-navDropdown.png'),
        text: 'Step 6: Navigate through the dropdown menu.',
    },
    {
        image: require('../assets/imgs/tutorial/step-7-navDropdown.png'),
        text: 'Step 7: Access additional features.',
    },
    {
        image: require('../assets/imgs/tutorial/step-8-navDropdown.png'),
        text: 'Step 8: Explore other options.',
    },
];

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

            {tutorialSteps.map((step, index) => (
                <View key={index} style={styles.tutorialStep}>
                    <Image source={step.image} style={styles.image} />
                    <Text style={[styles.stepText, {color: colors.text}]}>{step.text}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

export default HelpScreen;

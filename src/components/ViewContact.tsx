import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../screens/AppNavigator';
import {useTheme} from '../theme/themeContext'; // Import the Theme Context
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure this icon is available
import i18n from '../i18n'; // Import i18n for translations

type ViewContactRouteProp = RouteProp<RootStackParamList, 'ViewContact'>;

const ViewContact: React.FC = () => {
    const route = useRoute<ViewContactRouteProp>();
    const {contact} = route.params;

    const {darkMode} = useTheme(); // Get darkMode from context

    // Theme colors based on darkMode state
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <Image
                source={{uri: contact.image || 'default_image_uri'}} // Use a default image if null
                style={styles.image}
            />
            <View style={styles.contactInfo}>
                <Icon name="person" size={24} color={colors.text} />
                <Text style={[styles.text, {color: colors.text}]}>
                    {i18n.t('namePlaceholder')}: {contact.name}
                </Text>
            </View>
            <View style={styles.contactInfo}>
                <Icon name="phone" size={24} color={colors.text} />
                <Text style={[styles.text, {color: colors.text}]}>
                    {i18n.t('phonePlaceholder')}: {contact.phone}
                </Text>
            </View>
            <View style={styles.contactInfo}>
                <Icon name="email" size={24} color={colors.text} />
                <Text style={[styles.text, {color: colors.text}]}>
                    {i18n.t('emailPlaceholder')}: {contact.email}
                </Text>
            </View>
            <View style={styles.contactInfo}>
                <Icon name={contact.isEmployee ? 'work' : 'person'} size={24} color={colors.text} />
                <Text style={[styles.text, {color: colors.text}]}>
                    {i18n.t('role')}: {contact.isEmployee ? i18n.t('employee') : i18n.t('client')}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 8,
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
});

export default ViewContact;

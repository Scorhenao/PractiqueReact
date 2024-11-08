import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../screens/AppNavigator';
import {useTheme} from '../theme/themeContext'; // Import the Theme Context
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure this icon is available
import i18n from '../i18n'; // Import i18n for translations
import MapView, {Marker} from 'react-native-maps'; // Import map component
import axios from 'axios'; // To make API calls for weather info

type ViewContactRouteProp = RouteProp<RootStackParamList, 'ViewContact'>;

const ViewContact: React.FC = () => {
    const route = useRoute<ViewContactRouteProp>();
    const {contact} = route.params;

    const {darkMode} = useTheme(); // Get darkMode from context
    const [weather, setWeather] = useState<any>(null); // Weather data state
    const [isWeatherLoading, setIsWeatherLoading] = useState(true); // Loading state for weather

    // Theme colors based on darkMode state
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    // Fetch weather information based on the contact's location
    useEffect(() => {
        if (contact.location) {
            axios
                .get(`https://api.openweathermap.org/data/2.5/weather`, {
                    params: {
                        lat: contact.location.latitude,
                        lon: contact.location.longitude,
                        appid: 'cef79c5526143f4464385b042afcf95f', // Replace with your API key
                        units: 'metric',
                    },
                })
                .then(response => {
                    setWeather(response.data);
                    setIsWeatherLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    setIsWeatherLoading(false);
                });
        }
    }, [contact.location]);

    return (
        <ScrollView>
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
                    <Icon
                        name={contact.isEmployee ? 'work' : 'person'}
                        size={24}
                        color={colors.text}
                    />
                    <Text style={[styles.text, {color: colors.text}]}>
                        {i18n.t('role')}:{' '}
                        {contact.isEmployee ? i18n.t('employee') : i18n.t('client')}
                    </Text>
                </View>

                {/* Map View */}
                {contact.location && (
                    <MapView
                        style={styles.map}
                        region={{
                            latitude: contact.location.latitude,
                            longitude: contact.location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}>
                        <Marker coordinate={contact.location} />
                    </MapView>
                )}

                {/* Weather Information */}
                {isWeatherLoading ? (
                    <Text style={[styles.text, {color: colors.text}]}>
                        {i18n.t('loadingWeather')}
                    </Text>
                ) : weather ? (
                    <View style={styles.weatherInfo}>
                        <Text style={[styles.text, {color: colors.text}]}>
                            {i18n.t('weather')}:
                        </Text>
                        <Text style={[styles.text, {color: colors.text}]}>
                            {weather.weather[0].description}
                        </Text>
                        <Text style={[styles.text, {color: colors.text}]}>
                            {i18n.t('temperature')}: {weather.main.temp}°C
                        </Text>
                    </View>
                ) : (
                    <Text style={[styles.text, {color: colors.text}]}>
                        {i18n.t('weatherError')}
                    </Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    map: {
        width: '100%',
        height: 200,
        marginVertical: 20,
    },
    weatherInfo: {
        marginTop: 20,
        alignItems: 'center',
    },
});

export default ViewContact;

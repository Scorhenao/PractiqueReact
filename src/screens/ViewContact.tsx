import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useTheme} from '../context/themeContext';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import Icon from 'react-native-vector-icons/MaterialIcons';
import i18n from '../i18n';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';
import {OPEN_WEATHER_MAP_KEY} from '@env';
import {RootStackParamList} from './types/NavigationTypes';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type ViewContactRouteProp = RouteProp<RootStackParamList, 'ViewContact'>;

const DEFAULT_IMAGE = 'https://via.placeholder.com/250';

const ViewContact: React.FC = () => {
    const route = useRoute<ViewContactRouteProp>();
    const {contact} = route.params;

    const {darkMode} = useTheme();
    const [weather, setWeather] = useState<any>(null);
    const [isWeatherLoading, setIsWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState(false);

    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    const defaultCoordinates = {
        latitude: 37.7749,
        longitude: -122.4194,
    };

    const latitude = contact.latitude || defaultCoordinates.latitude;
    const longitude = contact.longitude || defaultCoordinates.longitude;

    useEffect(() => {
        if (latitude && longitude) {
            setIsWeatherLoading(true);
            axios
                .get('https://api.openweathermap.org/data/2.5/weather', {
                    params: {
                        lat: latitude,
                        lon: longitude,
                        appid: OPEN_WEATHER_MAP_KEY || 'cef79c5526143f4464385b042afcf95f',
                        units: 'metric',
                    },
                })
                .then(response => {
                    if (response.data && response.data.weather) {
                        setWeather(response.data);
                        setWeatherError(false);
                    } else {
                        setWeatherError(true);
                    }
                })
                .catch(error => {
                    console.error('Error al obtener el clima:', error);
                    setWeatherError(true);
                })
                .finally(() => setIsWeatherLoading(false));
        } else {
            setIsWeatherLoading(false);
        }
    }, [latitude, longitude]);

    const getWeatherIcon = () => {
        if (!weather) {
            return 'cloud';
        }
        const mainWeather = weather.weather[0].main.toLowerCase().trim();
        switch (mainWeather) {
            case 'clear':
                return 'sun';
            case 'clouds':
                return 'cloud';
            case 'rain':
                return 'cloud-rain';
            case 'snow':
                return 'snowflake';
            case 'drizzle':
            case 'mist':
            case 'haze':
                return 'cloud-drizzle';
            default:
                return 'cloud';
        }
    };

    return (
        <ScrollView>
            <View style={[styles.container, {backgroundColor: colors.background}]}>
                <Image
                    source={
                        contact.profilePicture
                            ? {uri: contact.profilePicture}
                            : {uri: DEFAULT_IMAGE}
                    }
                    style={styles.image}
                    resizeMode="cover"
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

                <MapView
                    style={styles.map}
                    region={{
                        latitude,
                        longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}>
                    <Marker coordinate={{latitude, longitude}} />
                </MapView>

                <Text style={[styles.locationText, {color: colors.text}]}>
                    {i18n.t('selectedLocation')}: Lat: {latitude.toFixed(4)}, Long:{' '}
                    {longitude.toFixed(4)}
                </Text>

                {isWeatherLoading ? (
                    <View style={styles.weatherContainer}>
                        <Text style={[styles.weatherText, {color: colors.text}]}>
                            {i18n.t('loadingWeather')}
                        </Text>
                    </View>
                ) : weatherError ? (
                    <View style={styles.weatherContainer}>
                        <Text style={[styles.weatherText, {color: colors.text}]}>
                            {i18n.t('weatherError')}
                        </Text>
                    </View>
                ) : weather ? (
                    <View style={styles.weatherContainer}>
                        <FontAwesome
                            name={getWeatherIcon()}
                            size={24}
                            color={colors.text}
                            style={styles.weatherIcon}
                        />
                        <Text style={[styles.weatherText, {color: colors.text}]}>
                            {weather.weather[0].description}, {weather.main.temp}°C
                        </Text>
                    </View>
                ) : (
                    <View style={styles.weatherContainer}>
                        <Text style={[styles.weatherText, {color: colors.text}]}>
                            {i18n.t('noWeather')}
                        </Text>
                    </View>
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
        marginLeft: 10,
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    map: {
        width: '100%',
        height: 200,
        marginVertical: 20,
        borderRadius: 8,
    },
    locationText: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    weatherContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    weatherText: {
        fontSize: 16,
        marginLeft: 10,
    },
    weatherIcon: {
        marginRight: 8,
    },
});

export default ViewContact;

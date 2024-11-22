import React, {useState, useEffect} from 'react';
import {View, TextInput, TouchableOpacity, Image, Alert, Text, ScrollView} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-picker/picker';
import colorsDarkMode from '../theme/colorsLightMode';
import colorsLightMode from '../theme/colorsDarkMode';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {RootStackParamList} from '../screens/types/NavigationTypes';
import Config from '../../config';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';
import Animated, {
    SlideInLeft,
    SlideInRight,
    SlideOutLeft,
    SlideOutRight,
} from 'react-native-reanimated';
import styles from './styles/AddContact.styles';
import useContacts from '../hooks/useContacts';
import {useTheme} from '../context/themeContext';

type AddContactRouteProp = RouteProp<RootStackParamList, 'AddContact'>;

const AddContact = () => {
    const {t} = useTranslation();
    const route = useRoute<AddContactRouteProp>();
    const initialLocation = route.params?.location || null;

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [contactType, setContactType] = useState('Client');
    const [imageUri, setImageUri] = useState('');
    const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(
        initialLocation,
    );
    const {addContact} = useContacts(); // Hook to handle adding contacts
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsDarkMode : colorsLightMode;
    const [weather, setWeather] = useState<any>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for success message

    const apiKey = Config.openWeatherMapKey;

    useEffect(() => {
        if (route.params?.location) {
            setLocation(route.params.location);
        }
    }, [route.params?.location]);

    const handleImagePick = async (source: 'camera' | 'gallery') => {
        const options = {
            mediaType: 'photo' as const,
            includeBase64: true,
        };

        const result =
            source === 'camera' ? await launchCamera(options) : await launchImageLibrary(options);

        if (result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            uri ? setImageUri(uri) : Alert.alert('Error', 'Failed to get image URI');
        } else {
            Alert.alert('Error', 'Failed to pick an image');
        }
    };

    const handleSave = () => {
        if (!name || !phone) {
            Alert.alert(t('errorMessage'));
            return;
        }

        const newContact: any = {
            name,
            email,
            phone,
            image: imageUri,
            contactType: 'Employee',
            logitud: location?.longitude,
            latitud: location?.latitude,
            profilePicture: imageUri,
        };

        addContact(newContact, imageUri); // Pass imageUri for uploading
        setShowSuccessMessage(true); // Show success message
        setTimeout(() => {
            setShowSuccessMessage(false); // Hide message after 2 seconds
            navigation.goBack(); // Go back after success
        }, 2000);
    };

    const handleLocationSelect = () => {
        navigation.navigate('SelectLocation' as any, {location});
    };

    // Fetch weather when location is set
    useEffect(() => {
        if (location) {
            const fetchWeather = async () => {
                try {
                    const response = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric`,
                    );
                    setWeather(response.data);
                } catch (error: any) {
                    Alert.alert('Error', 'Unable to fetch weather data');
                }
            };

            fetchWeather();
        }
    }, [apiKey, location]);

    // Determine icon based on weather
    const getWeatherIcon = () => {
        if (!weather) {
            return 'cloud';
        }
        const mainWeather = weather.weather[0].main.toLowerCase().trim(); // Added .trim() to remove extra spaces

        if (mainWeather === 'clear') {
            return 'sun'; // Matches clear weather
        }
        if (mainWeather === 'clouds') {
            return 'cloud'; // Handles cloud cover
        }
        if (mainWeather === 'rain') {
            return 'cloud-rain'; // Handles rain
        }
        if (mainWeather === 'snow') {
            return 'snowflake'; // Handles snow
        }
        if (mainWeather === 'drizzle' || mainWeather === 'mist' || mainWeather === 'haze') {
            return 'cloud-drizzle'; // Handles drizzle, mist, and haze
        }
        return 'cloud'; // Default fallback
    };

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <ScrollView>
                <View style={[styles.container, {backgroundColor: colors.background}]}>
                    <View style={styles.imageContainer}>
                        {imageUri ? (
                            <Image source={{uri: imageUri}} style={styles.image} />
                        ) : (
                            <Text style={styles.noImageSelected}>{t('NoImageSelected')}</Text>
                        )}
                    </View>
                    {/* Animated input fields */}
                    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
                        <TextInput
                            placeholder={t('namePlaceholder')}
                            placeholderTextColor={colors.placeholder}
                            style={[
                                styles.input,
                                {backgroundColor: colors.inputBackground, color: colors.text},
                            ]}
                            onChangeText={setName}
                        />
                    </Animated.View>

                    <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
                        <TextInput
                            placeholder={t('phonePlaceholder')}
                            placeholderTextColor={colors.placeholder}
                            style={[
                                styles.input,
                                {backgroundColor: colors.inputBackground, color: colors.text},
                            ]}
                            onChangeText={setPhone}
                        />
                    </Animated.View>

                    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
                        <TextInput
                            placeholder={t('emailPlaceholder')}
                            placeholderTextColor={colors.placeholder}
                            style={[
                                styles.input,
                                {backgroundColor: colors.inputBackground, color: colors.text},
                            ]}
                            onChangeText={setEmail}
                        />
                    </Animated.View>

                    <Picker
                        selectedValue={contactType}
                        style={{color: colors.text, backgroundColor: colors.inputBackground}}
                        onValueChange={itemValue => setContactType(itemValue)}>
                        <Picker.Item label={t('client')} value="Client" />
                        <Picker.Item label={t('employee')} value="Employee" />
                    </Picker>
                    <TouchableOpacity onPress={handleLocationSelect} style={styles.button}>
                        <FontAwesome name="map-marker" size={20} color={colors.text} />
                        <Text style={[styles.buttonText, {color: colors.text}]}>
                            {t('selectLocation')}
                        </Text>
                    </TouchableOpacity>

                    {/* Show map if location is selected */}
                    {location && (
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}>
                                <Marker coordinate={location} />
                            </MapView>
                            <Text style={styles.locationText}>
                                {t('selectedLocation')}: Lat: {location.latitude}, Long:{' '}
                                {location.longitude}
                            </Text>
                        </View>
                    )}

                    {/* Display weather if available */}
                    {weather ? (
                        <View style={styles.weatherContainer}>
                            <FontAwesome name={getWeatherIcon()} size={24} color={colors.text} />
                            <Text style={styles.weatherText}>
                                {weather.weather[0].description}, {weather.main.temp}°C
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.noWeatherText}>{t('noWeather')}</Text>
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => handleImagePick('gallery')}
                            style={styles.button}>
                            <FontAwesome name="photo" size={20} color={colors.text} />
                            <Text style={[styles.buttonText, {color: colors.text}]}>
                                {t('chooseImage')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleImagePick('camera')}
                            style={styles.button}>
                            <FontAwesome name="camera" size={20} color={colors.text} />
                            <Text style={[styles.buttonText, {color: colors.text}]}>
                                {t('takePicture')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Success message */}
                    {showSuccessMessage && (
                        <View style={styles.successMessage}>
                            <Text style={styles.successMessage}>{t('contactAdded')}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={handleSave}
                        style={[styles.saveButton, {backgroundColor: colors.primary}]}>
                        <Text style={[styles.buttonText, {color: colors.text}]}>
                            {t('saveContact')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default AddContact;

import React, {useState, useEffect} from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    Text,
    ScrollView,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-picker/picker';
import colorsDarkMode from '../theme/colorsLightMode';
import colorsLightMode from '../theme/colorsDarkMode';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../theme/themeContext';
import {useTranslation} from 'react-i18next';
import {RootStackParamList} from '../screens/types/NavigationTypes';
import Config from '../../config';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';
import IContact from '../components/interfaces/contact.interface';
import useContacts from '../components/hooks/useContacts';

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

    const {addContact} = useContacts();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsDarkMode : colorsLightMode;
    const [weather, setWeather] = useState<any>(null);

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
            Alert.alert(t('errorMessage'), t('fillRequiredFields'));
            return;
        }

        const newContact: IContact = {
            id: Date.now(),
            name,
            phone,
            email,
            image: imageUri,
            isEmployee: contactType === 'Employee',
            location,
        };

        addContact(newContact);
        Alert.alert(t('successMessage'));
        navigation.goBack();
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
    }, [location]);

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
                    <TextInput
                        placeholder={t('namePlaceholder')}
                        placeholderTextColor={colors.placeholder}
                        style={[
                            styles.input,
                            {backgroundColor: colors.inputBackground, color: colors.text},
                        ]}
                        onChangeText={setName}
                    />
                    <TextInput
                        placeholder={t('phonePlaceholder')}
                        placeholderTextColor={colors.placeholder}
                        style={[
                            styles.input,
                            {backgroundColor: colors.inputBackground, color: colors.text},
                        ]}
                        onChangeText={setPhone}
                    />
                    <TextInput
                        placeholder={t('emailPlaceholder')}
                        placeholderTextColor={colors.placeholder}
                        style={[
                            styles.input,
                            {backgroundColor: colors.inputBackground, color: colors.text},
                        ]}
                        onChangeText={setEmail}
                    />
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
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <FontAwesome name="save" size={20} color="#fff" />
                        <Text style={styles.saveButtonText}>{t('save')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    image: {
        marginTop: 20,
        width: 150,
        height: 150,
        borderRadius: 100,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        marginTop: 20,
    },
    buttonText: {
        marginLeft: 10,
    },
    saveButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
    },
    noImageSelected: {
        color: '#fc0804',
        marginTop: 6,
        marginBottom: 6,
        textAlign: 'center',
    },
    mapContainer: {
        height: 250, // Adjust size as needed
        marginVertical: 20,
    },
    map: {
        flex: 1,
        borderRadius: 10,
    },
    locationText: {
        color: '#555',
        textAlign: 'center',
        marginTop: 10,
    },
    weatherContainer: {
        marginTop: 20,
    },
    weatherText: {
        fontSize: 18,
        marginBottom: 5,
    },
    noWeatherText: {
        fontSize: 16,
        color: 'gray',
    },
});

export default AddContact;

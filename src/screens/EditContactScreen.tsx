import React, {useState, useEffect} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity, Text, Image, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Picker} from '@react-native-picker/picker';
import {useTheme} from '../context/themeContext';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import {useTranslation} from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {launchImageLibrary} from 'react-native-image-picker';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';
import Config from '../../config';
import IContact from '../interfaces/contact.interface';
import useContacts from '../hooks/useContacts';
import {RootStackParamList} from './types/NavigationTypes';
import {notify} from '../components/NotificationManager';

type EditContactScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditContact'>;

const EditContact: React.FC = () => {
    const navigation = useNavigation<EditContactScreenNavigationProp>();
    const route = useRoute();
    const {loadContacts, updateContact} = useContacts();
    const {contact} = route.params as {contact: IContact};

    const {t} = useTranslation();
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    const [name, setName] = useState(contact.name);
    const [phone, setPhone] = useState(contact.phone);
    const [email, setEmail] = useState(contact.email);
    const [image, setImage] = useState(contact.image || '');
    const [contactType, setContactType] = useState(contact.isEmployee ? 'Employee' : 'Client');
    const [location, setLocation] = useState(contact.location || {latitude: 0, longitude: 0});
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        if (location.latitude && location.longitude) {
            // Fetch weather data based on location
            fetchWeather(location.latitude, location.longitude);
        }
    }, [location]);

    const fetchWeather = async (lat: number, lon: number) => {
        const apikey = Config.openWeatherMapKey;
        try {
            const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    lat,
                    lon,
                    appid: apikey, // Replace with your OpenWeatherMap API key
                    units: 'metric',
                },
            });
            setWeather(response.data);
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    const handleImagePick = async () => {
        const options = {
            mediaType: 'photo' as const,
            includeBase64: true,
        };

        const result = await launchImageLibrary(options);

        if (result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            if (uri) {
                setImage(uri);
            } else {
                notify('danger', 'Error', 'Failed to get image URI.');
            }
        } else {
            notify('danger', 'Error', 'Failed to pick an image.');
        }
    };

    const handleSave = async () => {
        // Prepare the updated contact data
        const updatedContact: IContact = {
            ...contact,
            name: name || contact.name,
            phone: phone || contact.phone,
            email: email || contact.email,
            image: image || contact.image,
            isEmployee: contactType === 'Employee',
            location: location,
            profilePicture: image || contact.image, // Ensure to update the profile picture
            latitude: location.latitude,
            longitude: location.longitude, // Location coordinates
        };

        try {
            // Call the updateContact function, which will make the PATCH request
            await updateContact(updatedContact);
            await loadContacts(); // Reload the contacts after the update

            // Notify the user about the successful update
            notify('success', t('success'), t('contact Updated Successfully'));

            // Navigate back to the AppContainer screen
            navigation.navigate('AppContainer');
        } catch (error) {
            // Notify the user about the error
            notify('danger', t('error'), t('failed To Update Contact'));
            console.error('Error updating contact:', error);
        }
    };

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}>
                {/* Contact Image */}
                <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
                    {image ? (
                        <Image source={{uri: image}} style={styles.image} />
                    ) : (
                        <FontAwesome name="user-circle" size={100} color={colors.placeholder} />
                    )}
                    <TouchableOpacity style={styles.editIconContainer} onPress={handleImagePick}>
                        <FontAwesome name="pencil" size={24} color="#fff" />
                    </TouchableOpacity>
                </TouchableOpacity>

                {/* Name, Phone, Email Inputs */}
                <View style={styles.inputContainer}>
                    <FontAwesome name="user" size={20} style={styles.icon} />
                    <TextInput
                        placeholder={t('namePlaceholder')}
                        value={name}
                        onChangeText={setName}
                        style={[
                            styles.input,
                            {backgroundColor: colors.inputBackground, color: colors.text},
                        ]}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <FontAwesome name="phone" size={20} style={styles.icon} />
                    <TextInput
                        placeholder={t('phonePlaceholder')}
                        value={phone}
                        onChangeText={setPhone}
                        style={[
                            styles.input,
                            {backgroundColor: colors.inputBackground, color: colors.text},
                        ]}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <FontAwesome name="envelope" size={20} />
                    <TextInput
                        placeholder={t('emailPlaceholder')}
                        value={email}
                        onChangeText={setEmail}
                        style={[
                            styles.input,
                            {backgroundColor: colors.inputBackground, color: colors.text},
                        ]}
                    />
                </View>

                {/* Contact Type Picker */}
                <Picker
                    selectedValue={contactType}
                    onValueChange={itemValue => setContactType(itemValue)}
                    style={{color: colors.text, backgroundColor: colors.inputBackground}}>
                    <Picker.Item label={t('employee')} value="Employee" />
                    <Picker.Item label={t('client')} value="Client" />
                </Picker>

                {/* Map View */}
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        onPress={e => setLocation(e.nativeEvent.coordinate)}>
                        <Marker coordinate={location} />
                    </MapView>
                    {weather && (
                        <View style={styles.weatherContainer}>
                            <Text style={styles.weatherText}>
                                {t('weather')}: {weather.main.temp}°C,{' '}
                                {weather.weather[0].description}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Save Button */}
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <FontAwesome name="save" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>{t('save')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 10,
        right: 90,
        backgroundColor: '#007BFF',
        borderRadius: 50,
        padding: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        height: 40,
        flex: 1,
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
        marginLeft: 10,
    },
    mapContainer: {
        marginVertical: 20,
        height: 200,
    },
    map: {
        flex: 1,
    },
    weatherContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderRadius: 5,
    },
    weatherText: {
        color: '#fff',
    },
    scrollContainer: {
        overflow: 'hidden',
    },
});

export default EditContact;

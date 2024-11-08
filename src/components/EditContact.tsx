import React, {useState, useEffect} from 'react';
import {View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../screens/AppNavigator';
import useContacts from './hooks/useContacts';
import IContact from './interfaces/contact.interface';
import {Picker} from '@react-native-picker/picker';
import {useTheme} from '../theme/themeContext';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import {useTranslation} from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {launchImageLibrary} from 'react-native-image-picker';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';
import Config from '../../config';

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
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
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
                Alert.alert(t('error'), t('failedToGetImageUri'));
            }
        } else {
            Alert.alert(t('error'), t('failedToPickImage'));
        }
    };

    const handleSave = async () => {
        const updatedContact: IContact = {
            ...contact,
            name: name || contact.name,
            phone: phone || contact.phone,
            email: email || contact.email,
            image: image || contact.image,
            isEmployee: contactType === 'Employee',
            location: location, // Save location
        };

        await updateContact(updatedContact);
        await loadContacts();

        Alert.alert(t('success'), t('contactUpdated'), [
            {
                text: t('ok'),
                onPress: () => navigation.navigate('AppContainer'),
            },
        ]);
    };

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
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
                <FontAwesome name="user" size={20} color={colors.icon} style={styles.icon} />
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
                <FontAwesome name="phone" size={20} color={colors.icon} style={styles.icon} />
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
                <FontAwesome name="envelope" size={20} color={colors.icon} style={styles.icon} />
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
                            {t('weather')}: {weather.main.temp}°C, {weather.weather[0].description}
                        </Text>
                    </View>
                )}
            </View>

            {/* Save Button */}
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <FontAwesome name="save" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>{t('save')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
});

export default EditContact;

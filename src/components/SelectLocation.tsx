import React, {useState, useEffect, useCallback} from 'react';
import {View, Button, StyleSheet, Text} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../screens/types/NavigationTypes';
import {useLocation} from '../context/LocationContext';
import Geolocation from 'react-native-geolocation-service'; // Import geolocation service

type SelectLocationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectLocation'>;

type SelectLocationProps = {
    navigation: SelectLocationScreenNavigationProp;
};

const SelectLocation: React.FC<SelectLocationProps> = ({navigation}) => {
    const {location, getLocation} = useLocation();
    const [region, setRegion] = useState<Region | null>(null);
    const [selectedCoordinate, setSelectedCoordinate] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [weather, setWeather] = useState<any>(null);

    useEffect(() => {
        getLocation();
    }, [getLocation]);

    useEffect(() => {
        if (location) {
            setRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        }
    }, [location]);

    const fetchWeatherData = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_OPENWEATHERMAP_API_KEY`,
            );
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const handleSelectLocation = useCallback(() => {
        if (selectedCoordinate) {
            navigation.navigate('AddContact', {location: selectedCoordinate});
        }
    }, [navigation, selectedCoordinate]);

    const handlePlaceSelect = (data: any, details: any | null) => {
        const {lat, lng} = details?.geometry.location || {};
        if (lat && lng) {
            setRegion({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
            setSelectedCoordinate({latitude: lat, longitude: lng});

            // Fetch weather data for the selected location
            fetchWeatherData(lat, lng);
        }
    };

    const handleMapPress = (e: {
        nativeEvent: {coordinate: {latitude: number; longitude: number}};
    }) => {
        const {coordinate} = e.nativeEvent;
        setSelectedCoordinate(coordinate);
    };

    // Function to get the current location of the user
    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const {latitude, longitude} = position.coords;
                setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                setSelectedCoordinate({latitude, longitude});
            },
            error => {
                console.error(error);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
    };

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder="Search for places"
                onPress={handlePlaceSelect} // Automatically passes (data, details)
                query={{
                    key: 'YOUR_GOOGLE_PLACES_API_KEY',
                    language: 'en',
                }}
                styles={{
                    container: {position: 'absolute', top: 10, width: '90%', zIndex: 1},
                    listView: {backgroundColor: 'white'},
                }}
                fetchDetails={true}
            />
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={
                    region || {
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }
                }
                onPress={handleMapPress} // This will pass the event with nativeEvent
                zoomEnabled={true}
                pitchEnabled={true}
                showsUserLocation={true}
                showsMyLocationButton={true}>
                {selectedCoordinate && (
                    <Marker
                        coordinate={selectedCoordinate}
                        title="Selected Location"
                        description="This is the selected location"
                    />
                )}
            </MapView>

            {weather && (
                <View style={styles.weatherInfo}>
                    <Text>Weather: {weather.weather[0].description}</Text>
                    <Text>Temperature: {weather.main.temp}°C</Text>
                </View>
            )}

            <Button
                title="Select Location"
                onPress={handleSelectLocation}
                disabled={!selectedCoordinate}
            />
            <Button
                title="Locate Me"
                onPress={getCurrentLocation} // Add button to get current location
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '80%',
    },
    weatherInfo: {
        marginTop: 20,
        padding: 10,
    },
});

export default SelectLocation;

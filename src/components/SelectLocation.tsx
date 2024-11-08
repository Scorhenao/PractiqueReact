import React, {useState, useEffect, useCallback} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../screens/types/NavigationTypes';
import {useLocation} from '../context/LocationContext';

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

    const handleSelectLocation = useCallback(() => {
        if (selectedCoordinate) {
            navigation.navigate('AddContact', {location: selectedCoordinate});
        }
    }, [navigation, selectedCoordinate]);

    const handleMapPress = (coordinate: {latitude: number; longitude: number}) => {
        setSelectedCoordinate(coordinate);
    };

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder="Search for places"
                onPress={(data, details = null) => {
                    const {lat, lng} = details?.geometry.location || {};
                    if (lat && lng) {
                        setRegion({
                            latitude: lat,
                            longitude: lng,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        });
                        setSelectedCoordinate({latitude: lat, longitude: lng});
                    }
                }}
                query={{
                    key: 'YOUR_GOOGLE_PLACES_API_KEY', // Make sure to use your actual API key
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
                } // Fallback region
                onPress={e => handleMapPress(e.nativeEvent.coordinate)}
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

            <Button
                title="Select Location"
                onPress={handleSelectLocation}
                disabled={!selectedCoordinate}
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
});

export default SelectLocation;

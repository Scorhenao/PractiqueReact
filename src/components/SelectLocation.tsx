import React, {useState, useEffect, useCallback} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import MapView, {Marker, AnimatedRegion, PROVIDER_GOOGLE} from 'react-native-maps';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../screens/types/NavigationTypes';
import {useLocation} from '../context/LocationContext';

type SelectLocationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectLocation'>;

type SelectLocationProps = {
    navigation: SelectLocationScreenNavigationProp;
};

const SelectLocation: React.FC<SelectLocationProps> = ({navigation}) => {
    const {location, getLocation} = useLocation();
    const [region, setRegion] = useState<AnimatedRegion | null>(null);

    useEffect(() => {
        getLocation();
    }, [getLocation]);

    useEffect(() => {
        if (location) {
            setRegion(
                new AnimatedRegion({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }),
            );
        }
    }, [location]);

    const handleSelectLocation = useCallback(
        (lat: number, long: number) => {
            navigation.navigate('AddContact', {location: {latitude: lat, longitude: long}});
        },
        [navigation],
    );

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE} // IMPORTANTE: usa PROVIDER_GOOGLE si estás usando Google Maps
                style={styles.map}
                region={region ? region.getLatLng() : undefined}
                onRegionChangeComplete={newRegion => {
                    if (region) {
                        region.setValue(newRegion);
                    }
                }}
                onPress={e => {
                    const coordinate = e.nativeEvent.coordinate;
                    handleSelectLocation(coordinate.latitude, coordinate.longitude);
                }}>
                {location && <Marker coordinate={location} />}
            </MapView>

            <Button title="Select Location" onPress={() => handleSelectLocation(12.34, 56.78)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '80%',
    },
});

export default SelectLocation;

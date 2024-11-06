import React, {useState} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const SelectLocation: React.FC = ({navigation}) => {
    const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);

    const handleSelectLocation = (lat: number, long: number) => {
        const loc = {latitude: lat.toString(), longitude: long.toString()};
        setLocation({latitude: lat, longitude: long});
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <MapView
                provider="google" // Aquí especificamos que queremos usar Google Maps
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onPress={e => {
                    const {latitude, longitude} = e.nativeEvent.coordinate;
                    handleSelectLocation(latitude, longitude);
                }}>
                {location && <Marker coordinate={location} title="Selected Location" />}
            </MapView>
            <Button
                title="Select Location"
                onPress={() => handleSelectLocation(12.34, 56.78)} // Coordenadas de ejemplo
            />
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

import React, {useState} from 'react';
import {View, Button, StyleSheet, Text} from 'react-native';
import {RouteProp, NavigationProp} from '@react-navigation/native';
import Config from '../../config'; // Import Config here

// Define the route prop type specifically for SelectLocation
type SelectLocationRouteProp = RouteProp<
    {
        SelectLocation: {
            onLocationSelected: (loc: {latitude: string; longitude: string}) => void;
        };
    },
    'SelectLocation'
>;

// Define navigation prop type for Stack Navigator
type SelectLocationNavigationProp = NavigationProp<any>;

// Define the props expected by the SelectLocation component
interface SelectLocationProps {
    route: SelectLocationRouteProp;
    navigation: SelectLocationNavigationProp;
}

const SelectLocation: React.FC<SelectLocationProps> = ({route, navigation}) => {
    const {onLocationSelected} = route.params;
    const [location, setLocation] = useState<{latitude: string; longitude: string} | null>(null);

    const handleSelectLocation = (lat: string, long: string) => {
        const loc = {latitude: lat, longitude: long};
        setLocation(loc);
        onLocationSelected(loc);
        navigation.goBack();
    };

    // Example usage of the API Key (if needed for functionality)
    console.log('Using API Key in SelectLocation:', Config.apiKey);

    return (
        <View style={styles.container}>
            {/* Add map or location selection logic here */}
            <Text>Location Selector (Map or other)</Text>
            <Button
                title="Select Location"
                onPress={() => handleSelectLocation('12.34', '56.78')}
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
});

export default SelectLocation;

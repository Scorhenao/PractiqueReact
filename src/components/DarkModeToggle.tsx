import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '../context/themeContext'; // Importa el contexto de tema

interface DarkModeToggleProps {
    onPress: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({onPress}) => {
    const {darkMode} = useTheme(); // Obtén el estado del modo oscuro

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <FontAwesome name={darkMode ? 'sun-o' : 'moon-o'} size={20} color="white" />
            <Text style={styles.text}>{darkMode ? 'Light Mode' : 'Dark Mode'}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    text: {
        marginLeft: 8,
        color: 'white', // Establece el color según tus necesidades
    },
});

export default DarkModeToggle;

import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '../context/themeContext'; // Importa el contexto de tema
import colorsLightMode from '../theme/colorsLightMode';
import colorsDarkMode from '../theme/colorsDarkMode';

interface DarkModeToggleProps {
    onPress: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({onPress}) => {
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <FontAwesome color={colors.text} name={darkMode ? 'sun-o' : 'moon-o'} size={20} />
            <Text style={[styles.text, {color: colors.text}]}>{darkMode ? 'Light Mode' : 'Dark Mode'}</Text>
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
    },
});

export default DarkModeToggle;

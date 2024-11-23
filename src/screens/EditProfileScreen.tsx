import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import useUsers from '../hooks/useUsers';
import {notify} from '../components/NotificationManager';
import {useTheme} from '../context/themeContext';
import colorsLightMode from '../theme/colorsLightMode';
import colorsDarkMode from '../theme/colorsDarkMode';
import {authService} from '../services/authService';
import {useNavigation} from '@react-navigation/native';

const EditProfileScreen: React.FC = () => {
    const {getUserById, updateUser, loading, error} = useUsers();
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const {darkmode} = useTheme();
    const colors = darkmode ? colorsLightMode : colorsDarkMode;

    const [userId, setUserId] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await authService.getUserIdFromToken();
            if (id) {
                setUserId(id);
                console.log('User ID fetched:', id);
            } else {
                notify('danger', 'Error', 'User ID not found.');
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                const fetchedUser = await getUserById(userId);
                if (fetchedUser) {
                    setUser(fetchedUser);
                    setName(fetchedUser.name);
                    setEmail(fetchedUser.email);
                } else {
                    notify('danger', 'Error', 'Failed to fetch user data.');
                }
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const handleUpdate = async () => {
        if (name && email && userId) {
            const updatedUser = {id: userId, name, email};
            console.log('Updating user with:', updatedUser);

            try {
                const result = await updateUser(userId, updatedUser);
                console.log('Update result:', result);

                if (result.success) {
                    notify('success', 'Profile Updated', 'Your profile has been updated.');
                    navigation.navigate('AppContainer');
                } else {
                    notify('danger', 'Update Failed', result.message || 'Something went wrong');
                }
            } catch (err) {
                console.error('Error updating user:', err);
                notify('danger', 'Update Failed', 'An unexpected error occurred');
            }
        } else {
            notify('danger', 'Invalid Input', 'Please fill out both fields.');
        }
    };

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                style={styles.input}
            />
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                style={styles.input}
            />
            <TouchableOpacity onPress={handleUpdate} disabled={loading} style={styles.button}>
                <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>

            {loading && <Text>Loading...</Text>}
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
});

export default EditProfileScreen;

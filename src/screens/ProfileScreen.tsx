import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Image, Alert, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {RootStackParamList} from './types/NavigationTypes';
import useUsers from '../hooks/useUsers';
import authService from '../services/authService';
import {useTheme} from '../context/themeContext';
import colorsLightMode from '../theme/colorsLightMode';
import colorsDarkMode from '../theme/colorsDarkMode';
import { notify } from '../components/NotificationManager';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileScreen'>;

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const {getUserById} = useUsers();
    const {darkmode} = useTheme();
    const colors = darkmode ? colorsLightMode : colorsDarkMode;

    const [user, setUser] = useState<any>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userIdFromToken = await authService.getUserIdFromToken();
            if (userIdFromToken) {
                const fetchedUser = await getUserById(userIdFromToken);
                if (fetchedUser) {
                    setUser(fetchedUser);
                } else {
                    Alert.alert('Error', 'Failed to fetch user data.');
                }
            } else {
                Alert.alert('Error', 'User ID not found in token.');
            }
        };
        fetchUserData();
    }, [getUserById]);

    const handleEditProfile = () => {
        if (user && user.id) {
            navigation.navigate('EditProfileScreen', {userId: user.id});
        } else {
            Alert.alert('Error', 'User data not available.');
        }
    };

    const handleLogout = async () => {
        try {
            await authService.removeToken();
            console.log('Token removed successfully');
        } catch (error) {
            console.error('Error removing token:', error);
            Alert.alert('Error', 'Failed to log out');
            return;
        }

        notify('success', 'Logged out', 'You have been successfully logged out.');
        navigation.navigate('HomeScreen');
    };

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
                <FontAwesome name="sign-out" size={24} color="{colors.text}" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.imageContainer}>
                    {profileImage ? (
                        <Image source={{uri: profileImage}} style={styles.image} />
                    ) : (
                        <FontAwesome name="user-circle" size={100} color="{colors.text}" />
                    )}

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.editButton]}
                            onPress={handleEditProfile}>
                            <FontAwesome name="pencil" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    logoutIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 50,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 10,
    },
    actionButton: {
        borderRadius: 50,
        padding: 15,
        marginHorizontal: 10,
        backgroundColor: '#007BFF',
    },
    saveButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    scrollContainer: {
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#007BFF',
    },
});

export default ProfileScreen;

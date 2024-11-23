import {IUser} from './../interfaces/user.interface';
import {useState} from 'react';
import axios from 'axios';
import {BaseUrl, EditUserByIdUrl} from '../utils/routes';

const useUsers = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getUserById = async (id: string): Promise<IUser | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${BaseUrl}/api/users/${id}`);
            if (response.status === 200) {
                return response.data;
            } else {
                setError(`Failed to fetch user data: ${response.statusText}`);
                return null;
            }
        } catch (err: any) {
            setError(`Failed to fetch user data: ${err.message}`);
            console.error('Error fetching user:', err.response ? err.response.data : err.message);
            return null;
        } finally {
            setLoading(false); // Asegúrate de que `setLoading(false)` esté en `finally` para que se ejecute siempre
        }
    };

    const updateUser = async (id: string, updatedUser: IUser): Promise<any> => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.patch(`${BaseUrl}${EditUserByIdUrl}${id}`, updatedUser, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Update response:', response); // Log para revisar la respuesta

            if (response.status === 200) {
                return {success: true, data: response.data};
            } else {
                const message = response.data.message || 'Something went wrong';
                return {success: false, message};
            }
        } catch (err: any) {
            setError('Failed to update user');
            console.error('Error updating user:', err);
            return {success: false, message: 'An error occurred while updating the profile.'};
        } finally {
            setLoading(false); // Asegúrate de que `setLoading(false)` esté en `finally` para que se ejecute siempre
        }
    };

    return {
        getUserById,
        updateUser,
        loading,
        error,
    };
};

export default useUsers;

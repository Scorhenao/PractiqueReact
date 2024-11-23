import {useState, useCallback} from 'react';
import axios from 'axios';
import {BaseUrl, SearchContactUrl} from '../utils/routes';
import authService from '../services/authService';

const api = axios.create({
    baseURL: BaseUrl,
});

const useSearchContacts = () => {
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const getAuthHeaders = async () => {
        const token = await authService.getToken();
        if (!token) {
            console.error('No token found');
            throw new Error('No token available');
        }
        return {
            Authorization: `Bearer ${token}`,
        };
    };

    const searchContacts = useCallback(
        async (query: string, searchType: 'email' | 'phone' | 'name') => {
            setLoading(true);
            try {
                const headers = await getAuthHeaders();
                const response = await api.get(SearchContactUrl, {
                    headers,
                    params: {[searchType]: query},
                });
                if (response.data) {
                    setSearchResults(response.data);
                } else {
                    setSearchResults([]);
                }
                console.log('Search Results:', response.data);
            } catch (error: any) {
                console.error('Error searching contacts', error.response?.data || error.message);
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return {
        searchResults,
        loading,
        searchContacts,
    };
};

export default useSearchContacts;

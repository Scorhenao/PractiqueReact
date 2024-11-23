import React, {useState, useMemo} from 'react';
import {
    StyleSheet,
    View,
    RefreshControl,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
    SectionList,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import ContactCard from '../components/ContactCard';
import AddFloatingButton from '../components/AddFloatingButton';
import useContacts from '../hooks/useContacts';
import {useTheme} from '../context/themeContext';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import NavBar from '../components/navBar';
import IContact from '../interfaces/contact.interface';
import LoadingAnimation from '../components/AnimatedTextComponent';
import useSearchContacts from '../hooks/useSearchContacts';

export const AppContainer: React.FC = () => {
    const {contacts, loadContacts, deleteContact} = useContacts();
    const {searchResults, loading: searchLoading, searchContacts} = useSearchContacts();
    const [refreshing, setRefreshing] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    const onRefresh = () => {
        setRefreshing(true);
        loadContacts();
        setRefreshing(false);
    };

    const closeDropdown = () => {
        setDropdownVisible(false);
        Keyboard.dismiss();
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim().length >= 2) {
            searchContacts(query, 'name');
        } else if (query.trim() === '') {
            searchContacts('', 'name'); // Limpia la búsqueda
        }
    };

    // Decide qué contactos mostrar
    const isSearching = searchQuery.length > 0;
    const contactsToDisplay = isSearching ? searchResults : contacts;

    // Agrupa los contactos solo si no hay búsqueda activa
    const groupedContacts = useMemo(() => {
        if (isSearching) {
            return [];
        }
        const groups: {[key: string]: IContact[]} = {};
        contactsToDisplay.forEach(contact => {
            const firstLetter = contact.name.charAt(0).toUpperCase();
            if (!groups[firstLetter]) {
                groups[firstLetter] = [];
            }
            groups[firstLetter].push(contact);
        });

        return Object.keys(groups)
            .sort()
            .map(letter => ({
                title: letter,
                data: groups[letter],
            }));
    }, [contactsToDisplay, isSearching]);

    return (
        <TouchableWithoutFeedback onPress={closeDropdown}>
            <View style={[styles.container, {backgroundColor: colors.background}]}>
                {searchLoading ? (
                    <LoadingAnimation onFinished={() => null} />
                ) : (
                    <>
                        <NavBar
                            toggleDropdown={toggleDropdown}
                            dropdownVisible={dropdownVisible}
                            onSearch={handleSearch}
                        />
                        {isSearching && (
                            <View style={styles.searchHeader}>
                                <Text style={[styles.searchHeaderText, {color: colors.text}]}>
                                    {`Resultados de búsqueda (${searchResults.length})`}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => handleSearch('')}
                                    style={styles.clearButton}>
                                    <Text style={[styles.clearButtonText, {color: colors.link}]}>
                                        Limpiar búsqueda
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {isSearching ? (
                            <FlatList
                                data={contactsToDisplay}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({item}) => (
                                    <ContactCard
                                        contact={item}
                                        darkMode={darkMode}
                                        onDelete={deleteContact}
                                        style={styles.searchResultCard}
                                    />
                                )}
                                ListEmptyComponent={
                                    <View style={styles.noResultsContainer}>
                                        <Text style={[styles.noResultsText, {color: colors.text}]}>
                                            No se encontraron contactos
                                        </Text>
                                    </View>
                                }
                            />
                        ) : (
                            <SectionList
                                sections={groupedContacts}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({item}) => (
                                    <ContactCard
                                        contact={item}
                                        darkMode={darkMode}
                                        onDelete={deleteContact}
                                    />
                                )}
                                renderSectionHeader={({section: {title}}) => (
                                    <Text
                                        style={[
                                            styles.sectionHeader,
                                            {
                                                backgroundColor: colors.background,
                                                color: colors.text,
                                            },
                                        ]}>
                                        {title}
                                    </Text>
                                )}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                }
                                stickySectionHeadersEnabled
                            />
                        )}
                        {searchLoading && <ActivityIndicator size="small" color={colors.text} />}
                        <AddFloatingButton
                            buttonColor={darkMode ? colorsDarkMode.link : colorsLightMode.link}
                        />
                    </>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    searchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#f0f0f0',
    },
    searchHeaderText: {
        fontSize: 16,
        fontWeight: '600',
    },
    clearButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    clearButtonText: {
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    searchResultCard: {
        backgroundColor: '#e6f7ff',
        borderColor: '#007acc',
        borderWidth: 1,
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

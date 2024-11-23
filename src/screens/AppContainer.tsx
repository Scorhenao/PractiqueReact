import React, {useState, useRef} from 'react';
import {
    StyleSheet,
    View,
    RefreshControl,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
} from 'react-native';
import Animated, {LinearTransition} from 'react-native-reanimated';
import ContactCard from '../components/ContactCard';
import AddFloatingButton from '../components/AddFloatingButton';
import useContacts from '../hooks/useContacts';
import {useTheme} from '../context/themeContext';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import NavBar from '../components/navBar';
import IContact from '../interfaces/contact.interface';
import LoadingAnimation from '../components/AnimatedTextComponent';

export const AppContainer: React.FC = () => {
    const {contacts, loadContacts, deleteContact} = useContacts();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [page, setPage] = useState(1); // Estado para la página de contactos
    const [loadingMore, setLoadingMore] = useState(false); // Indicador de carga de más elementos
    const [loadingMessage, setLoadingMessage] = useState<string>(''); // Mensaje de carga
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1); // Resetea la página al refrescar
        loadContacts(); // Carga los primeros contactos
        setRefreshing(false);
    };

    const loadMoreContacts = () => {
        if (loadingMore) {
            return;
        } // Evita cargar más si ya estamos cargando
        setLoadingMessage('Cargando más contactos...');
        setLoadingMore(true);
        setPage(prevPage => {
            const nextPage = prevPage + 1;
            loadContacts(); // Carga más contactos de la página siguiente
            return nextPage;
        });
    };

    const handleAnimationFinish = () => {
        setTimeout(() => {
            setLoading(false);
        }, 6000);
    };

    const renderContactCard = ({item}: {item: IContact}) => (
        <ContactCard contact={item} darkMode={darkMode} onDelete={deleteContact} />
    );

    const closeDropdown = () => {
        setDropdownVisible(false);
        Keyboard.dismiss();
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const containerRef = useRef<View>(null);

    return (
        <TouchableWithoutFeedback onPress={closeDropdown}>
            <View
                style={[styles.container, {backgroundColor: colors.background}]}
                ref={containerRef}>
                {loading ? (
                    <LoadingAnimation onFinished={handleAnimationFinish} />
                ) : (
                    <>
                        <NavBar toggleDropdown={toggleDropdown} dropdownVisible={dropdownVisible} />
                        <Animated.FlatList
                            data={contacts}
                            renderItem={renderContactCard}
                            keyExtractor={item => item.id.toString()}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                            itemLayoutAnimation={LinearTransition}
                            onEndReached={loadMoreContacts} // Llama a loadMoreContacts cuando llegamos al final
                            onEndReachedThreshold={0.1} // Carga más datos cuando está cerca del final
                            ListFooterComponent={
                                loadingMore ? (
                                    <>
                                        <LoadingAnimation onFinished={handleAnimationFinish} />
                                        <Text
                                            style={{
                                                color: colors.text,
                                                textAlign: 'center',
                                                marginVertical: 10,
                                            }}>
                                            {loadingMessage}
                                        </Text>
                                    </>
                                ) : null
                            } // Muestra un loading al final con mensaje
                        />
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
});

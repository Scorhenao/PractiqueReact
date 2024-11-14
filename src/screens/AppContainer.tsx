import React, {useState} from 'react';
import {StyleSheet, View, RefreshControl} from 'react-native';
import Animated, {LinearTransition} from 'react-native-reanimated';
import ContactCard from '../components/ContactCard';
import AddFloatingButton from '../components/AddFloatingButton';
import useContacts from '../components/hooks/useContacts';
import {useTheme} from '../theme/themeContext';
import colorsDarkMode from '../theme/colorsDarkMode';
import colorsLightMode from '../theme/colorsLightMode';
import LoadingAnimation from '../components/AnimatedTextComponent';
import NavBar from '../components/navBar';
import IContact from '../components/interfaces/contact.interface';

const AppContainer: React.FC = () => {
    const {contacts, loadContacts, deleteContact} = useContacts();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const {darkMode} = useTheme();
    const colors = darkMode ? colorsLightMode : colorsDarkMode;

    const onRefresh = async () => {
        setRefreshing(true);
        await loadContacts();
        setRefreshing(false);
    };

    const handleAnimationFinish = () => {
        setTimeout(() => {
            setLoading(false);
        }, 6000);
    };

    const renderContactCard = ({item}: {item: IContact}) => (
        <ContactCard contact={item} darkMode={darkMode} onDelete={deleteContact} />
    );

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            {loading ? (
                <LoadingAnimation onFinished={handleAnimationFinish} />
            ) : (
                <>
                    <NavBar />
                    <Animated.FlatList
                        data={contacts}
                        renderItem={renderContactCard}
                        keyExtractor={item => item.id.toString()}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        itemLayoutAnimation={LinearTransition}
                    />
                    <AddFloatingButton
                        buttonColor={darkMode ? colorsDarkMode.link : colorsLightMode.link}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default AppContainer;

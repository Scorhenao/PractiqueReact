import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    navbarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        height: 64,
        width: '100%',
        zIndex: 1,
    },
    relative: {
        position: 'relative',
    },
    menuContainer: {
        position: 'absolute',
        width: 150,
        top: 40,
        left: 0,
        padding: 16,
        borderRadius: 8,
        zIndex: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    menuItemText: {
        marginLeft: 8,
    },
    dropdown: {
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginBottom: 15,
    },
    dropdownContainerStyle: {},
    center: {
        alignItems: 'center',
    },
    searchContainer: {
        display: 'flex',
        width: 210,
        height: 50,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 20,
        justifyContent: 'center',
    },
    inputContainer: {
        backgroundColor: '#e1e1e1',
        borderRadius: 20,
    },
    appTitle: {
        fontSize: 20,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginRight: 16,
    },
    profileContainer: {
        alignItems: 'center',
    },
    profileName: {
        textAlign: 'center',
    },
});

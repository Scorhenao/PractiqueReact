import {StyleSheet} from 'react-native';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        position: 'relative',
        width: '100%',
    },
    input: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    button: {
        height: 40,
        width: '100%',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 8,
    },
});

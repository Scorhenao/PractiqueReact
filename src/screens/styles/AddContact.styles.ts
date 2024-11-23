import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    image: {
        marginTop: 20,
        width: 150,
        height: 150,
        borderRadius: 100,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        marginTop: 20,
    },
    buttonText: {
        marginLeft: 10,
    },
    saveButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
    },
    noImageSelected: {
        color: '#fc0804',
        marginTop: 6,
        marginBottom: 6,
        textAlign: 'center',
    },
    mapContainer: {
        height: 250,
        marginVertical: 20,
    },
    map: {
        flex: 1,
        borderRadius: 10,
    },
    locationText: {
        color: '#555',
        textAlign: 'center',
        marginTop: 10,
    },
    weatherContainer: {
        marginTop: 20,
    },
    weatherText: {
        fontSize: 18,
        marginBottom: 5,
    },
    noWeatherText: {
        fontSize: 16,
        color: 'gray',
    },
    successMessage: {
        backgroundColor: '#4BB543',
        padding: 10,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
    },
    successText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: add a semi-transparent background
    },
});

export default styles;

import {StyleSheet} from 'react-native';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 10,
        right: 90,
        backgroundColor: '#007BFF',
        borderRadius: 50,
        padding: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        height: 40,
        flex: 1,
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
        marginLeft: 10,
    },
    mapContainer: {
        marginVertical: 20,
        height: 200,
    },
    map: {
        flex: 1,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
});

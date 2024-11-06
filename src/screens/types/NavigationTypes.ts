import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import IContact from '../../components/interfaces/contact.interface';
export type RootStackParamList = {
    Home: undefined; // No parameters for Home
    EditContact: {contact: IContact}; // Parameters for EditContact
    SelectLocation: {onLocationSelected: (loc: {latitude: number; longitude: number}) => void};
};

export type EditContactScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'EditContact'
>;

export type EditContactScreenRouteProp = RouteProp<RootStackParamList, 'EditContact'>;

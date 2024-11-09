import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import IContact from '../../components/interfaces/contact.interface';
export type RootStackParamList = {
    Home: undefined;
    AddContact: {location: {latitude: number; longitude: number}};
    EditContact: {contact: IContact};
    SelectLocation: {onLocationSelected: (loc: {latitude: number; longitude: number}) => void};
    SettingsScreen: undefined;
};

export type EditContactScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'EditContact'
>;

export type EditContactScreenRouteProp = RouteProp<RootStackParamList, 'EditContact'>;

import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import IContact from '../../components/interfaces/contact.interface';
export type RootStackParamList = {
    AppContainer: undefined;
    AddContact: undefined;
    EditContact: {contact: IContact};
    ViewContact: {contact: IContact};
    SelectLocation: {onLocationSelected: (loc: {latitude: string; longitude: string}) => void}; // Agregar SelectLocation con sus parámetros
    SettingsScreen: undefined;
    Login: undefined;
    Register: undefined;
};

export type EditContactScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'EditContact'
>;

export type EditContactScreenRouteProp = RouteProp<RootStackParamList, 'EditContact'>;

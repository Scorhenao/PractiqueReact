import {Contact} from '../../../hooks/useGetContacts';

export interface GetContactsResponse {
    success: boolean;
    data?: Contact[];
    message?: string;
}

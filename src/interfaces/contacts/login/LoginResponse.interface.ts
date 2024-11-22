import { LoginRequestResponse } from './LoginRequestResponse.interface';
export interface LoginResponse {
    success: boolean;
    data: LoginRequestResponse;
}

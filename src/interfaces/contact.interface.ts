interface IContact {
    id: number;
    name: string;
    phone: string;
    email: string;
    image: string | null;
    profilePicture: string | null;
    isEmployee: boolean; // Employee or Client
    latitude: number;
    longitude: number;
    location: {latitude: number; longitude: number} | null; // Added location
}



export default IContact;

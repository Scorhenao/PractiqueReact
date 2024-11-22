interface IContact {
    id: number;
    name: string;
    phone: string;
    email: string;
    image: string | null;
    isEmployee: boolean; // Employee or Client
    location: {latitude: number; longitude: number} | null; // Added location
}



export default IContact;

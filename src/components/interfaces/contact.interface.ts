interface IContact {
    id: number;
    name: string;
    phone: string;
    email: string;
    image: string | null;
    isEmployee: boolean; // Employee or Client
}

export default IContact;

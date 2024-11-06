import React, {createContext, useContext, useState, ReactNode} from 'react';

interface LocationContextType {
    onLocationSelected: (loc: {latitude: string; longitude: string}) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};

interface LocationProviderProps {
    children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({children}) => {
    const [location, setLocation] = useState<{latitude: string; longitude: string} | null>(null);

    const onLocationSelected = (loc: {latitude: string; longitude: string}) => {
        setLocation(loc);
    };

    return (
        <LocationContext.Provider value={{onLocationSelected}}>{children}</LocationContext.Provider>
    );
};

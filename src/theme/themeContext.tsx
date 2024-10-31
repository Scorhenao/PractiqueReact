// ThemeContext.tsx
import React, {createContext, useContext, useState, ReactNode} from 'react';

interface ThemeContextType {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <ThemeContext.Provider value={{darkMode, setDarkMode}}>{children}</ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
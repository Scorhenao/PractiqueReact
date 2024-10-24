// Define an interface for the light mode color palette
interface IColorsLight {
    primary: string;
    background: string;
    text: string;
    secondaryBackground: string;
    link: string;
    hover: string;
    navBackground: string;
}

// Define the light mode colors
const colorsLightMode: IColorsLight = {
    primary: '#007BFF', // Main color for buttons, highlights, and interactive elements.
    background: '#FFFFFF', // Main background color of the app (light background).
    text: '#101422', // Text color for main text and titles (dark text for readability).
    secondaryBackground: '#F0F0F0', // Light background for secondary sections or cards.
    link: '#007BFF', // Blue color for links and secondary buttons.
    hover: '#0056b3', // Darker blue for hover and active state.
    navBackground: '#F8F9FA', // Lighter color for navigation bar or headers.
};

export default colorsLightMode;

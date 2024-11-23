// You can do the same for dark mode colors if needed
interface IColorsDark {
    primary: string;
    background: string;
    text: string;
    secondaryBackground: string;
    link: string;
    hover: string;
    navBackground: string;
    placeholder: string; // Add placeholder color
    inputBackground: string; // Add input background color
    textContacts: string;
}

// Define the dark mode colors
const colorsDarkMode: IColorsDark = {
    primary: '#A8DCE7', // Main color for buttons, highlights, and interactive elements.
    background: '#2a2b2f', // Main background color of the app.
    text: '#FFFFFF', // Text color for main text and titles.
    textContacts: '#FFFFFF', // Text color for main text and titles.
    secondaryBackground: '#272B3B', // Background color for secondary sections or cards.
    link: '#00d5ff', // Color for links or secondary buttons.
    hover: '#A8DCE7', // Color for hover or active state.
    navBackground: '#272B3B', // Background color for the navigation bar or headers.
    placeholder: '#FFFFFF', // Define the color for placeholders
    inputBackground: '#272B3B', // Define background for inputs
};
export default colorsDarkMode;

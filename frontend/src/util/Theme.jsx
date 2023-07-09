import { createTheme } from '@mui/material/styles';

// Create a custom theme
const AppTheme = createTheme({
    typography: {
        fontFamily: 'Lato, sans-serif'
    },
    palette: {
        accent: {
            main: '#9398FC', 
            secondary: '#6858D8'
        },
        page: {
            main: '#FDFCFF',
            secondary: '#F6F6F6' 
        },
        text: {
            main: '#211E22'
        }
    },
});

export default AppTheme;
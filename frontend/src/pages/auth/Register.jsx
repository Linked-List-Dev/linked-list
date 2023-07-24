import React from 'react';
import LoginSide from '../../components/LoginSide'
import RegisterSide from '../../components/RegisterSide';
import {ThemeProvider, 
    Typography, 
    Button, 
    Box,
    Stack
} from '@mui/material';
import AppTheme from '../../util/Theme'

function Register({ openModal }) {
  return (
    <div>
        <ThemeProvider theme={AppTheme}>
        <Box
      sx={{
        display: "flex",
        width: "100vw",
        // Add media query to stack components at 100vw on small screens
        "@media (max-width: 768px)": {
          width: "100vw",
          flexDirection: "column",
          alignContent: 'center',
          textAlign: 'center'
        },
      }}
    >
      <LoginSide openByDefault={openModal} />
      <RegisterSide />
    </Box>
        </ThemeProvider>
    </div>
  )
}

export default Register;
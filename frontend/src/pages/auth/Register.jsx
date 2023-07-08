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

function Register() {
  return (
    <div>
        <ThemeProvider theme={AppTheme}>
            <Box sx={{ display: 'flex', width: '100%' }}>
                <LoginSide/>
                <RegisterSide/>
            </Box>
        </ThemeProvider>
    </div>
  )
}

export default Register;
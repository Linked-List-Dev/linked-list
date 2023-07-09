import React from 'react';
import {ThemeProvider, 
        Typography, 
        Button, 
        Box,
        Stack
    } from '@mui/material';
import AppTheme from '../util/Theme'
import LinkedListLogoLight from '../assets/LinkedListLogoLight.svg'
import { Link } from 'react-router-dom';

function NavigationBar(){
    return(
        <div>
            <ThemeProvider theme={AppTheme}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center', 
                    color: 'text.main',
                    backgroundColor: 'page.main',
                    minHeight: '10vh',
                    paddingLeft: '2vw',
                    borderBottom: '3px solid #EBEBEB'
                    }}>
                    <Stack spacing={15} direction="row" alignItems="flex-end">
                    <img src={LinkedListLogoLight} height={'70vh'} />
                    <Typography variant="h4" sx={{ minWidth: 100, paddingBottom: '.5vh' }}>Explore</Typography>
                    <Typography variant="h4" sx={{ minWidth: 100, paddingBottom: '.5vh' }}>About</Typography>
                    <Typography variant="h4" sx={{ minWidth: 100, paddingBottom: '.5vh' }}>Contribution</Typography>
                    </Stack>
                    <Stack spacing={2} direction="row" sx={{ marginLeft: 'auto', paddingRight: '2vw' }}>
                        <Button variant="outlined" size="large" sx={{
                            color: 'accent.main',
                            borderRadius: 4,
                            borderWidth: 3,
                            borderColor: 'accent.main',
                            width: '8vw',
                            height: '70px',
                            textAlign: 'center',
                            textTransform: 'none'
                            }}
                            component={Link}
                            to='/login'>
                            <Typography variant="h5" sx={{ minWidth: 100 }}>Sign In</Typography>
                        </Button>
                        <Button variant="conatined" size="large" sx={{
                            backgroundColor: 'accent.main',
                            borderRadius: 4,
                            width: '8vw',
                            height: '70px',
                            textAlign: 'center',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'accent.secondary'
                              }
                            }}
                            component={Link}
                            to='/register'>
                        <Typography variant="h5" sx={{ minWidth: 100 }}>Sign Up</Typography>
                        </Button>
                    </Stack>
                </Box>
            </ThemeProvider>
        </div>
    )
}

export default NavigationBar
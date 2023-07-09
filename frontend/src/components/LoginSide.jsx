import React from 'react';
import { useState } from 'react';
import {ThemeProvider, 
        Typography, 
        Button, 
        Box,
        Modal,
        Stack,
        TextField,
        Divider
    } from '@mui/material';
import AppTheme from '../util/Theme'
import { Link } from 'react-router-dom';
import IconDark from '../assets/IconDark.svg'
import facebook from '../assets/socials/facebook.svg'
import google from '../assets/socials/google.svg'
import linkedin from '../assets/socials/linkedin.svg'

function LoginSide({openByDefault}) {
    const [open, setOpen] = useState(openByDefault);
    const [formValues, setFormValues] = useState({
        email: '',
        password: ''
      })
    const [error, setError] = useState('')

    const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
    }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // ARTEM TODO: Login
        console.log(formValues)
    }

    const handleResetError = () => {
        setError('');
    }

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <ThemeProvider theme={AppTheme}>
        <Box
          sx={{
            background: 'linear-gradient(to top, #9398FC, #6858D8)',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              paddingLeft: '2vw',
              paddingTop: '2vh',
            }}
          >
            <Link to='/'>
              <img src={IconDark} alt="Icon"/>
            </Link>
          </Box>
  
          <Box
            sx={{
              width: '50vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
                paddingLeft: '5vw',
                paddingRight: '5vw',
              }}
            >
              <Typography variant="h1">Welcome Back!</Typography>
              <Typography variant="h4" sx={{ paddingBottom: '2vh' }}>
                To keep connected with us please log in with your account information.
              </Typography>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  color: 'white',
                  borderColor: 'accent.secondary',
                  textTransform: 'none',
                  borderRadius: 4,
                  borderWidth: 3,
                  width: '15vw',
                  height: '80px',
                }}
                onClick={handleOpen}
              >
                <Typography variant="h4">Sign In</Typography>
              </Button>
            </Box>
          </Box>
  
          <Modal open={open} onClose={handleClose} sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' }}>
            <Box sx={{ 
                backgroundColor: 'page.main', 
                borderRadius: 10,
                width: '40vw',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center'
                }}>
                <Box paddingTop='3vh' paddingBottom='3vh'>
                    <Typography color='accent.main' variant='h1'>Sign In</Typography>
                    <Stack 
                    spacing={5} 
                    direction="row" 
                    alignItems="flex-end" 
                    justifyContent='center'
                    paddingTop='2vh'
                    paddingBottom='2vh'>

                    {/* Future TODO: social media authentication... */}
                    <img src={facebook} width={75}/>
                    <img src={google} width={75}/>
                    <img src={linkedin} width={75}/>
                    </Stack>
                    <Divider sx={{
                        fontFamily: 'Lato, sans-serif', 
                        paddingTop: '1vh', 
                        paddingBottom: '1vh',
                        color: '#211E2250'}}>OR</Divider>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3} sx={{paddingBottom: 3}}>
                            <TextField
                                variant='outlined'
                                name="email"
                                label="Email"
                                type="email"
                                value={formValues.email}
                                onChange={handleChange}
                                fullWidth
                                required
                                sx={{width: '25vw'}}
                            />
                            <TextField
                                variant='outlined'
                                name="password"
                                label="Password"
                                type="password"
                                value={formValues.password}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={Boolean(error)}
                                helperText={error}
                                onFocus={handleResetError}
                            />
                        </Stack>
                            <Button
                                type='submit'
                                variant="contained"
                                size="large"
                                sx={{
                                backgroundColor: 'accent.main',
                                textTransform: 'none',
                                borderRadius: 4,
                                width: '10vw',
                                height: '80px',
                                '&:hover': {
                                    backgroundColor: 'accent.secondary'
                                },
                                color: 'text.main'
                                }}>
                                <Typography variant="h4">Sign In</Typography>
                            </Button>
                            
                    </form>
                    </Box>
                
            </Box>
          </Modal>
        </Box>
      </ThemeProvider>
    );
}

export default LoginSide;
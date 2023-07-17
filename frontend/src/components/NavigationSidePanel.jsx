import * as React from 'react';
import { useState } from "react"
import LinkedListLogoLight from '../assets/LinkedListLogoLight.svg'
import AppTheme from '../util/Theme'
import { TextField, 
    Stack, 
    ThemeProvider,
    List,
    Typography,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Modal,
    Box, 
    Button} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import { Link } from 'react-router-dom';

function NavigationSidePanel() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [formValues, setFormValues] = useState({
        content: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formValues)

        //Artem TODO upload post refresh or do whatever you need to do
        // ඞඞඞ
    }

  return (
    <div>
        <ThemeProvider theme={AppTheme}>
            <Box height={'100vh'}>

                <Stack sx={{backgroundColor: 'page.main', height: '100vh', paddingTop: '2vh'}}>
                    <img src={LinkedListLogoLight} height={'50vh'}/>

                    <TextField
                        id="input-with-icon-textfield"
                        variant="filled"
                        sx={{paddingLeft: '2vw', paddingRight: '2vw', paddingTop: '2vh'}}
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                            ),
                        }}
                    />

                    <List>
                        <ListItem>
                            <ListItemButton component={Link} to='/feed'>
                                <ListItemIcon>
                                    <HomeIcon fontSize='large'/>
                                </ListItemIcon>
                                <ListItemText >
                                    <Typography variant='h4'>Home</Typography>
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>

                        <ListItem>
                            <ListItemButton onClick={handleOpen}>
                                <ListItemIcon>
                                    <AddBoxIcon fontSize='large'/>
                                </ListItemIcon>
                                <ListItemText >
                                    <Typography variant='h4'>New Post</Typography>
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>

                        <ListItem>
                            <ListItemButton component={Link} to='/profile'>
                                <ListItemIcon>
                                    {/*ARTEM TODO GET IMAGE FROM USER CAN USE SRC*/}
                                    <Avatar sx={{bgcolor: 'accent.main'}}>A</Avatar>
                                </ListItemIcon>
                                <ListItemText >
                                    <Typography variant='h4'>Profile</Typography>
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>

                        <ListItem>
                            <ListItemButton component={Link} to='*'>
                            <ListItemIcon>
                                <SettingsIcon fontSize='large'/>
                            </ListItemIcon>
                            <ListItemText>
                                <Typography variant='h4'>Settings</Typography>
                            </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Stack>
            </Box>

            <Modal
            open={open}
            onClose={handleClose}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Box
                    sx={{
                    backgroundColor: "page.main",
                    borderRadius: 5,
                    width: "40vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}>
                    <Box 
                        paddingTop="3vh" 
                        paddingBottom="3vh">
                    <Stack
                        spacing={5}
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        paddingTop="2vh"
                        paddingBottom="2vh">

                        <form onSubmit={handleSubmit}>
                            <Stack alignItems={'center'} spacing={3}>
                                <Typography variant='h3' color='accent.main'>
                                    New Post
                                </Typography>
                                <TextField
                                    sx={{width: '30vw'}}
                                    multiline
                                    rows={5}
                                    variant='outlined'
                                    name='content'
                                    label="What's on your mind?"
                                    value={formValues.content}
                                    onChange={handleChange}
                                    fullWidth
                                    required/>

                                <Button 
                                    type='submit'
                                    variant='contained'
                                    size='large'
                                    sx={{
                                        backgroundColor: "accent.main",
                                        textTransform: "none",
                                        borderRadius: 4,
                                        width: "7vw",
                                        height: "auto",
                                        "&:hover": {
                                            backgroundColor: "accent.secondary",
                                        },
                                    }}>
                                    <Typography variant='h4'>
                                        Post!
                                    </Typography>
                                </Button>
                            </Stack>
                            
                            
                        </form>
                    </Stack>

                    </Box>
                </Box>
            </Modal>
        </ThemeProvider>
    </div>
    
  );
}

export default NavigationSidePanel
import React from 'react';
import { useState } from "react"
import NavigationSidePanel from '../../components/NavigationSidePanel';
import AppTheme from '../../util/Theme'
import { Box, Typography, ThemeProvider } from '@mui/material';

function Profile() {
    const [userName ,setUserName] = useState()    
    const [jobTitle ,setJobTitle] = useState()
    const [biography ,setBiography] = useState()
    const [posts ,setPosts] = useState()
    const [profileImage ,setProfileImage] = useState()  
    const [headPhoto, setHeaderPhoto] = useState()  

  return (
    <div>
        <ThemeProvider theme={AppTheme}>
                <Box sx={{ display: 'flex', backgroundColor: 'page.secondary' }}>
                    <NavigationSidePanel/>

                    <Box sx={{ flex: 1, paddingLeft: '2vw', paddingRight: '2vw', paddingTop: '2vh'}}>
                        {/* Here goes the profile stuff*/}
                        <Typography variant='h2'>
                            About Me
                        </Typography>
                        <Typography variant='h2'>
                            Posts
                        </Typography>
                    </Box>

                </Box>
            </ThemeProvider>
    </div>
  )
}

export default Profile;
import React from 'react';
import {
  ThemeProvider, 
  Typography, 
  Button, 
  Box,
  Stack
} from '@mui/material';
import NavigationBar from '../../components/NavigationBar'
import AppTheme from '../../util/Theme'
import image1 from '../../assets/images/image1.webp'
import image2 from '../../assets/images/image2.svg'

function Landing() {
  return (
    <div style={{ backgroundColor: '#FDFCFF', minHeight: '100vh' }}>
      <ThemeProvider theme={AppTheme}>
        <NavigationBar/>
        <Box minWidth={'100vw'}> 
          <Stack 
            direction='row' 
            paddingTop={'10vh'}
            height="100%"
            spacing={5}
          >
            <Box
              justifyContent="center"
              alignItems="center"
              paddingLeft={'2vw'}
              maxWidth={'50vw'}
              textAlign={'center'}
              color={'text.main'}
            >
              <Typography variant='h2'>Not your average social media platform</Typography>
              <Typography variant='h4' paddingTop={2}>Welcome to LinkedList, a social media 
                platform designed exclusively for individuals in the tech industry. 
                Just like LinkedIn, but tailored specifically for tech enthusiasts, 
                LinkedList provides a powerful platform for tech professionals to showcase their skills, 
                build connections, and enhance their career prospects.</Typography>
            </Box>

            <Box
              justifyContent="center"
              alignItems="center"
              paddingRight={'2vw'}
              minWidth={'50vw'}
              textAlign={'right'}
              sx={{
                backgroundImage: `url(${image2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
            </Box>
          </Stack>
        </Box>
        
        <Box minWidth={'100vw'} paddingTop={'10vh'}> 
          <Stack direction='row' spacing={5}>
          <Box
              justifyContent="center"
              alignItems="center"
              height="100%"
              paddingLeft={'2vw'}
              minWidth={'50vw'}
              textAlign={'center'}
            >
              <img src={image1} style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}/>
            </Box>

            <Box
              justifyContent="center"
              alignItems="center"
              height="100%"
              paddingRight={'2vw'}
              maxWidth={'50vw'}
              textAlign={'center'}
              color={'text.main'}
            >
              <Typography variant='h2'>Key Features</Typography>
              <ul style={{textAlign: 'left'}}>
                <Stack spacing={2}>
                  <Typography variant='h4'>
                    <li>
                    Comprehensive Profiles: Create a detailed profile highlighting your educational background, profession, experience, and a captivating bio that tells your unique story.
                    </li>
                  </Typography>
                  
                  <Typography variant='h4'>
                    <li>
                    Project Showcase: Showcase your personal projects, side hustles, and open-source contributions with visually stunning project displays. Let the world see your coding prowess.
                    </li>
                  </Typography>
                  
                  <Typography variant='h4'>
                    <li>
                    Resume Display: Upload your resume and make it easily accessible to potential employers. LinkedList ensures that your talent shines through.
                    </li>
                  </Typography>
                  
                  <Typography variant='h4'>
                    <li>
                    Engaging Blog Posts: Share your thoughts, insights, and expertise with the community through captivating blog posts. Inspire others, spark discussions, and grow your professional network.
                    </li>
                  </Typography>
                  
                  <Typography variant='h4'>
                    <li>
                    Career Opportunities: Explore a wide range of job opportunities posted by reputable tech companies. Stay updated with the latest career prospects in the ever-evolving tech industry.
                    </li>
                  </Typography>
                  
                  <Typography variant='h4'>
                    <li>
                    Networking and Collaboration: Connect with like-minded tech professionals, form collaborations, and exchange knowledge. LinkedList is your gateway to building meaningful professional relationships.
                    </li>
                  </Typography>
                </Stack>
              </ul>
            </Box>
          </Stack>
        </Box>

      </ThemeProvider>
    </div>
  );
}

export default Landing;
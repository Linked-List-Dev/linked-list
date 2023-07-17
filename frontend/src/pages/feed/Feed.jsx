
import React from 'react';
import { useState } from "react"
import NavigationSidePanel from '../../components/NavigationSidePanel';
import AppTheme from '../../util/Theme'
import { Box, Stack, ThemeProvider } from '@mui/material';
import Post from '../../components/Post';

const placeholder = [
    {
        postId: 1,
        userName: 'Maserati Bugatti',
        jobTitle: 'Software Engineer',
        profilePhoto: 'https://www.catster.com/wp-content/uploads/2017/11/Mackerel-Tabby-cat.jpg.optimal.jpg',
        description: 'This is a post that I made',
        numLikes: 400
    },
    {
        postId: 2,
        userName: 'Drake',
        jobTitle: 'Certified Lover Boy',
        profilePhoto: 'https://i0.wp.com/o3v.a1b.mywebsitetransfer.com/wp-content/uploads/2019/09/Screen-Shot-2019-09-04-at-10.11.10-PM.png?resize=840%2C1060',
        description: 'Who wanna hire me?',
        numLikes: 1
    },
    {
        postId: 3,
        userName: 'Drake',
        jobTitle: 'Certified Lover Boy',
        profilePhoto: 'https://i0.wp.com/o3v.a1b.mywebsitetransfer.com/wp-content/uploads/2019/09/Screen-Shot-2019-09-04-at-10.11.10-PM.png?resize=840%2C1060',
        description: 'Somebody please give me a job dawg.',
        numLikes: 10
    }
]

function Feed(){
    const [posts, setPosts] = useState(placeholder)
    
    return(
        <div>
            <ThemeProvider theme={AppTheme}>
                <Box sx={{ display: 'flex', backgroundColor: 'page.secondary' }}>
                    <NavigationSidePanel sx={{position: 'fixed'}}/>
                    <Box sx={{ flex: 1, paddingLeft: '2vw', paddingRight: '2vw', paddingTop: '2vh'}}>
                        <Stack spacing={3}>
                            {posts.map((post) => (
                            <Post
                                key={post.postId}
                                _postId={post.postId}
                                _userName={post.userName}
                                _jobTitle={post.jobTitle}
                                _profilePhoto={post.profilePhoto}
                                _description={post.description}
                                _numLikes={post.numLikes}
                            />
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </ThemeProvider>
        </div>
    )
}

export default Feed
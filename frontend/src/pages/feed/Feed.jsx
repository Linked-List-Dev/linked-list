
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
        description: 'Hello everyone this is a post that I made!',
        numLikes: 400
    },
    {
        postId: 2,
        userName: 'Hozer',
        jobTitle: 'Senior UX Designer',
        profilePhoto: 'https://images.unsplash.com/photo-1593483316242-efb5420596ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JhbmdlJTIwY2F0fGVufDB8fDB8fHww&w=1000&q=80',
        description: 'Hello everyone I was recently laid off from Meta so if anyone needs a CEO of their company please message me!',
        numLikes: 1
    },
    {
        postId: 3,
        userName: 'Hozer',
        jobTitle: 'Senior UX Designer',
        profilePhoto: 'https://images.unsplash.com/photo-1593483316242-efb5420596ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JhbmdlJTIwY2F0fGVufDB8fDB8fHww&w=1000&q=80',
        description: 'Everyone check out my portfolio on my profile!',
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
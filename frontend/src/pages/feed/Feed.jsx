
import React, { useState, useEffect } from 'react';
import NavigationSidePanel from '../../components/NavigationSidePanel';
import AppTheme from '../../util/Theme'
import { Box, Stack, ThemeProvider } from '@mui/material';
import Post from '../../components/Post';
import axios from "axios"

function Feed() {
    const [posts, setPosts] = useState([]);

    async function getPosts() {
        const res = await axios.get("http://localhost:8000/api/feed/", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        console.log(res.status)
        if (res.status === 200 || res.status === 304) {
            // console.log("response.data.posts:", res.data.posts);
            setPosts(res.data.posts);
        } else {
            console.log("Tia TODO: display an error saying failed to load posts");
        }
    }


    const handlePostDelete = (postId) => {
        // Remove the deleted post from the posts array in the state
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    };
    
    useEffect(() => {
        getPosts();
    }, []);

    return (
        <div>
            <ThemeProvider theme={AppTheme}>
                <Box sx={{ display: 'flex', backgroundColor: 'page.secondary' }}>
                    <NavigationSidePanel onPostCreated={getPosts} sx={{ position: 'fixed' }} />
                    <Box sx={{ flex: 1, paddingLeft: '2vw', paddingRight: '2vw', paddingTop: '2vh' }}>
                        <Stack spacing={3}>
                            {posts.map((post) => (
                                <Post
                                    key={post._id}
                                    _postId={post._id}
                                    _userName={post.authorName}
                                    _jobTitle={post.authorJobTitle}
                                    _profilePhoto={'https://images.unsplash.com/photo-1593483316242-efb5420596ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JhbmdlJTIwY2F0fGVufDB8fDB8fHww&w=1000&q=80'} //todo
                                    _description={post.description}
                                    _likes={post.likes}
                                    _dislikes={post.dislikes}
                                    _authorId={post.authorId}
                                    onDeletePost={handlePostDelete}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </ThemeProvider>
        </div>
    );
}

export default Feed;

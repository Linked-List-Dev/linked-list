import React, { useState, useEffect } from "react";
import NavigationSidePanel from "../../components/NavigationSidePanel";
import AppTheme from "../../util/Theme";
import { Box, Stack, ThemeProvider } from "@mui/material";
import Post from "../../components/Post";
import axios from "axios";
import MobileSideNav from "../../components/Mobile/MobileSideNav";
import { useNavigate } from "react-router-dom";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const navigate = useNavigate();

    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      // Cleanup the event listener when the component is unmounted
      return () => {
        window.removeEventListener("resize", handleResize);
      };
     }, []);
  
    async function getPosts() {
        try {
            const res = await axios.get("http://localhost:8000/api/feed/", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.status === 200 || res.status === 304) {
                // console.log("response.data.posts:", res.data.posts);
                setPosts(res.data.posts);
            }
        } catch (err) {
            if (err.response.status === 401 || err.response.status === 400) {
                navigate('/register')
            }
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
        {windowWidth >= 768 ? (
          <Box
            sx={{
              display: "flex",
              backgroundColor: "page.secondary",
              maxHeight: "100vh",
            }}
          >
            <NavigationSidePanel
              onPostCreated={getPosts}
              sx={{ overflow: "hidden" }}
            />
            <Box
              sx={{
                flex: 1,
                paddingLeft: "2vw",
                paddingRight: "2vw",
                paddingTop: "2vh",
                overflow: "auto",
              }}
            >
              <Stack spacing={3}>
                {posts.map((post) => (
                  <Post
                    key={post._id}
                    _postId={post._id}
                    _userName={post.authorName}
                    _jobTitle={post.authorJobTitle}
                    _profilePhoto={
                      "https://images.unsplash.com/photo-1593483316242-efb5420596ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JhbmdlJTIwY2F0fGVufDB8fDB8fHww&w=1000&q=80"
                    } //todo
                    _description={post.description}
                    _likes={post.likes}
                    _dislikes={post.dislikes}
                    _authorId={post.authorId}
                    _comments={post.comments}
                    _createdAt={post.createdAt}
                    _updatedAt={post.updatedAt}
                    onDeletePost={handlePostDelete}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        ) : (
          <Box>
            <MobileSideNav onPostCreated={getPosts} />
            <Box
              sx={{
                flex: 1,
                paddingLeft: "2vw",
                paddingRight: "2vw",
                paddingTop: "67px",
                overflow: "auto",
              }}
            >
              <Stack spacing={3}>
                {posts.map((post) => (
                  <Post
                    key={post._id}
                    _postId={post._id}
                    _userName={post.authorName}
                    _jobTitle={post.authorJobTitle}
                    _profilePhoto={
                      "https://images.unsplash.com/photo-1593483316242-efb5420596ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JhbmdlJTIwY2F0fGVufDB8fDB8fHww&w=1000&q=80"
                    } //todo
                    _description={post.description}
                    _likes={post.likes}
                    _dislikes={post.dislikes}
                    _authorId={post.authorId}
                    _comments={post.comments}
                    _createdAt={post.createdAt}
                    _updatedAt={post.updatedAt}
                    onDeletePost={handlePostDelete}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        )}
      </ThemeProvider>
    </div>
  );
}

export default Feed;

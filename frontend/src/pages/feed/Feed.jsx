import React, { useState, useEffect } from "react";
import NavigationSidePanel from "../../components/NavigationSidePanel";
import AppTheme from "../../util/Theme";
import { Box, Stack, ThemeProvider, Typography } from "@mui/material";
import Post from "../../components/Post";
import axios from "axios";
import MobileSideNav from "../../components/Mobile/MobileSideNav";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [profilePictures, setProfilePictures] = useState({});
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [message, setMessage] = useState(
    "There are no posts yet... Want to add one?"
  );

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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 200 || res.status === 304) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      if (err.response.status === 401 || err.response.status === 400) {
        navigate("/register");
      }
    }
  }
  const handlePostDelete = (postId) => {
    // Remove the deleted post from the posts array in the state
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  useEffect(() => {
    getPosts()
  }, []);

  useEffect(() => {
    let isFetching = true; // Variable to keep track of whether profile pictures are still being fetched
  
    // Define an async function to fetch profile pictures
    async function fetchProfilePictures() {
      try {
        const profilePicturesData = {};
        for (const post of posts) {
          console.log("post:", post);
          if (post.authorProfilePictureId) {
            const res = await axios.get(
              `http://localhost:8000/api/users/profileImage/${post.authorProfilePictureId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                responseType: "arraybuffer",
              }
            );
  
            if (res.status === 200 || res.status === 304) {
              const blob = new Blob([res.data], {
                type: res.headers["content-type"],
              });
              const blobUrl = URL.createObjectURL(blob);
              profilePicturesData[post.authorProfilePictureId] = blobUrl;
            }
          }
        }
        setProfilePictures(profilePicturesData);
        isFetching = false; // Set the isFetching variable to false after all pictures are fetched
      } catch (error) {
        console.error("Error fetching profile pictures:", error);
        isFetching = false; // Set the isFetching variable to false if there was an error
      }
    }
  
    fetchProfilePictures();
  
    // Use another useEffect to set loading to false after all pictures are fetched
    const loadingTimer = setInterval(() => {
      if (!isFetching) {
        setLoading(false);
        clearInterval(loadingTimer);
      }
    }, 100);
  
    // Cleanup the interval if the component unmounts or if the posts change
    return () => {
      clearInterval(loadingTimer);
    };
  }, [posts]);

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
              {posts.length === 0 ? (
                <Typography
                  variant="h2"
                  sx={{
                    position: "absolute",
                    color: "text.secondary",
                    textAlign: "center",
                  }}
                >
                  {message}
                </Typography>
              ) : (
                <Box>
                  <Stack spacing={3}>
                    {posts.map((post) => {
                      console.log("post:", post);
                      console.log("profilePictures:", profilePictures);
                      console.log("profilePictures[post.authorProfilePictureId]:", profilePictures[post.authorProfilePictureId]);
                      console.log("loading:", loading)

                      return !loading && (
                        <Post
                          key={post._id}
                          _postId={post._id}
                          _userName={post.authorName}
                          _jobTitle={post.authorJobTitle}
                          _authorProfilePhoto={profilePictures[post.authorProfilePictureId]}
                          _description={post.description}
                          _likes={post.likes}
                          _dislikes={post.dislikes}
                          _authorId={post.authorId}
                          _comments={post.comments}
                          _createdAt={post.createdAt}
                          _updatedAt={post.updatedAt}
                          onDeletePost={handlePostDelete}
                        />
                      );
                    })}
                  </Stack>
                </Box>
              )}
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
              {posts.length === 0 ? (
                <Typography
                  variant="h2"
                  sx={{
                    position: "absolute",
                    color: "text.secondary",
                    textAlign: "center",
                  }}
                >
                  {message}
                </Typography>
              ) : (
                <Box>
                  <Stack spacing={3}>
                    {posts.map((post) => (
                      !loading && <Post
                        key={post._id}
                        _postId={post._id}
                        _userName={post.authorName}
                        _jobTitle={post.authorJobTitle}
                        _authorProfilePhoto={profilePictures[post.authorProfilePictureId]}
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
              )}
            </Box>
          </Box>
        )}
        <Footer />
      </ThemeProvider>
    </div>
  );
}

export default Feed;

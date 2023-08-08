import React, { useState, useEffect } from "react";
import NavigationSidePanel from "../../components/NavigationSidePanel";
import AppTheme from "../../util/Theme";
import {
  Box,
  Stack,
  ThemeProvider,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Post from "../../components/Post";
import axios from "axios";
import MobileSideNav from "../../components/Mobile/MobileSideNav";
import { useNavigate } from "react-router-dom";

function Feed() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [posts, setPosts] = useState([]);
  const [postProfilePictures, setPostProfilePictures] = useState({});
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [message, setMessage] = useState(""
    // "There are no posts yet... Want to add one?"
  );
  const [userProfilePicture, setUserProfilePicture] = useState("");

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

  const handlePostDelete = (postId) => {
    // Remove the deleted post from the posts array in the state
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const handlePostCreate = async (newPost) => {
    if (newPost.authorProfilePictureId) {
      try {
        if (newPost.authorProfilePictureId !== "") {
          const res = await axios.get(
            `${API_URL}/users/profileImage/${newPost.authorProfilePictureId}`,
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
            setPostProfilePictures((prevProfilePictures) => ({
              ...prevProfilePictures,
              [newPost.authorProfilePictureId]: blobUrl,
            }));
          }
        }
      } catch (err) {
        console.log(err);
        if (err.response.status === 401 || err.response.status === 400) {
          navigate("/register");
        }
      }
    }
    
    setPosts((prevPosts) => [...prevPosts, newPost]);
  }
  
  useEffect(() => {
    async function getPosts() {
      try {
        setLoading(true); // Start loading
  
        let profilePictureFetch = {}
        if (localStorage.getItem("profilePictureId") !== "") {
          profilePictureFetch = await axios.get(
            `${API_URL}/users/profileImage/${localStorage.getItem(
              "profilePictureId"
            )}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              responseType: "arraybuffer", // Set the responseType to arraybuffer
            }
          );
        }

        if (profilePictureFetch.status === 200 || profilePictureFetch.status === 304) {
          // Create a blob from the file data
          const blob = new Blob([profilePictureFetch.data], {
            type: profilePictureFetch.headers["content-type"],
          });
  
          // Convert the blob to a URL (blob URL)
          const blobUrl = URL.createObjectURL(blob);
          setUserProfilePicture(blobUrl);
        }

        const res = await axios.get(`${API_URL}/feed/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        if (res.status === 200 || res.status === 304) {
          // Create an object to store the profile pictures for each comment author
          const commentProfilePictures = {};
          const postProfilePicturesData = {};
  
          // Iterate through each post
          for (const post of res.data.posts) {
            if (post.authorProfilePictureId) {
              if (post.authorProfilePictureId !== ""){
                const res = await axios.get(
                  `${API_URL}/users/profileImage/${post.authorProfilePictureId}`,
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
                  postProfilePicturesData[post.authorProfilePictureId] = blobUrl;
                }
              }
            }
            // Iterate through each comment in the post
            for (const comment of post.comments) {
              try {
                if (comment.authorProfilePictureId !== ""){
                  const res = await axios.get(
                    `${API_URL}/users/profileImage/${comment.authorProfilePictureId}`,
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
                    commentProfilePictures[comment.authorProfilePictureId] = blobUrl;
                  }
                }
              } catch (err) {
                console.log(err);
                if (err.response.status === 401 || err.response.status === 400) {
                  navigate("/register");
                }
              }
            }
          }
  
          setPostProfilePictures(postProfilePicturesData);
  
          // Set the posts with the updated comment profile pictures
          const postsWithCommentsWithProfilePictures = res.data.posts.map((post) => ({
            ...post,
            comments: post.comments.map((comment) => ({
              ...comment,
              profilePicture: commentProfilePictures[comment.authorProfilePictureId] || "",
            })),
          }));
  
          setPosts(postsWithCommentsWithProfilePictures);
        }
      } catch (err) {
        if (err.response.status === 401 || err.response.status === 400) {
          navigate("/register");
        }
      } finally {
        setLoading(false); // Stop loading after fetching data, regardless of success or error
      }
    }
  
    getPosts();
  }, []);

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ThemeProvider theme={AppTheme}>
        {windowWidth >= 768 ? (
          <Box
            sx={{
              display: "flex",
              backgroundColor: "page.secondary",
              maxHeight: "100vh",
            }}
          >
            {!loading && (
              <NavigationSidePanel
                onPostCreated={handlePostCreate}
                _userProfilePicture={userProfilePicture}
                sx={{ overflow: "hidden" }}
              />
            )}
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
                    {posts
                     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                     .map((post) => {
                      return (
                        !loading && (
                          <Post
                            key={post._id}
                            _postId={post._id}
                            _userName={post.authorName}
                            _jobTitle={post.authorJobTitle}
                            _authorProfilePhoto={
                              postProfilePictures[post.authorProfilePictureId]
                            }
                            _description={post.description}
                            _likes={post.likes}
                            _dislikes={post.dislikes}
                            _authorId={post.authorId}
                            _comments={post.comments}
                            _createdAt={post.createdAt}
                            _updatedAt={post.updatedAt}
                            onDeletePost={handlePostDelete}
                          />
                        )
                      );
                    })}
                  </Stack>
                </Box>
              )}

              <Box
                sx={{
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "2vh",
                  color: "#cfcaca",
                }}
              >
                <Typography>
                  © {new Date().getFullYear()} Flores & Kolpakov. All rights
                  reserved.
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              backgroundColor: "page.secondary",
              maxHeight: "100vh",
            }}
          >
            {!loading && (
              <MobileSideNav
                onPostCreated={handlePostCreate}
                _userProfilePicture={userProfilePicture}
              />
            )}
            <Box
              sx={{
                flex: 1,
                paddingLeft: "2vw",
                paddingRight: "2vw",
                paddingTop: "70px",
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
                    {posts
                     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                     .map((post) =>
                        !loading && (
                          <Post
                            key={post._id}
                            _postId={post._id}
                            _userName={post.authorName}
                            _jobTitle={post.authorJobTitle}
                            _authorProfilePhoto={
                              postProfilePictures[post.authorProfilePictureId]
                            }
                            _description={post.description}
                            _likes={post.likes}
                            _dislikes={post.dislikes}
                            _authorId={post.authorId}
                            _comments={post.comments}
                            _createdAt={post.createdAt}
                            _updatedAt={post.updatedAt}
                            onDeletePost={handlePostDelete}
                          />
                        )
                    )}
                  </Stack>
                </Box>
              )}
              <Box
                sx={{
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "2vh",
                  color: "#cfcaca",
                }}
              >
                <Typography>
                  © {new Date().getFullYear()} Flores & Kolpakov. All rights
                  reserved.
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </ThemeProvider>
    </div>
  );
}

export default Feed;
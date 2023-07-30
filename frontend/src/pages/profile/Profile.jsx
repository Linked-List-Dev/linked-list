import React, { useState, useEffect } from "react";
import NavigationSidePanel from "../../components/NavigationSidePanel";
import AppTheme from "../../util/Theme";
import {
  Box,
  Typography,
  ThemeProvider,
  Stack,
  Paper,
  Avatar,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import Post from "../../components/Post";
import EditIcon from "@mui/icons-material/Edit";

import axios from "axios";
import { useParams } from "react-router-dom";
import MobileSideNav from "../../components/Mobile/MobileSideNav";
import Footer from "../../components/Footer";
import EditProfileModal from "../../components/Modals/EditProfileModal";

function Profile() {
  const { profileid } = useParams();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [jobTitle, setJobTitle] = useState("New user");
  const [biography, setBiography] = useState(
    "There's no bio yet... Click the edit button to add one!"
  );
  const [posts, setPosts] = useState([]);
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1593483316242-efb5420596ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JhbmdlJTIwY2F0fGVufDB8fDB8fHww&w=1000&q=80"
  );
  const [headPhoto, setHeaderPhoto] = useState(
    "https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?cs=srgb&dl=pexels-chait-goli-1796730.jpg&fm=jpg"
  );

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [successVis, setSuccessVis] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessVis(false);
  };

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

  const [formValues, setFormValues] = useState({
    name: "",
    bio: "",
    jobTitle: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formValues);

    // Make PUT request to update user data
    const res = await axios.put(
      `http://localhost:8000/api/users/${userId}`,
      formValues,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("res.status:", res.status);
    if (res.status === 200) {
      // Update the state variables with the updated user data
      setUserName(res.data.name);
      setJobTitle(res.data.jobTitle);
      setBiography(res.data.bio);
      setOpen(false);
      setSuccessVis(true);
    } else {
      console.log(
        "Tia TODO: display an error saying failed to update user info (res.data.error)"
      );
    }
  };

  const handlePostDelete = (postId) => {
    // Remove the deleted post from the posts array in the state
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/users/${profileid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(res.status);
      if (res.status === 200 || res.status === 304) {
        const userData = res.data.user;
        console.log("userData:", userData);
        setUserId(userData._id);
        setUserName(userData.name);
        setJobTitle(userData.jobTitle);
        setBiography(userData.bio);
        setPosts(userData.posts);

        setFormValues({
          name: userData.name,
          jobTitle: userData.jobTitle,
          bio: userData.bio,
        });
      } else {
        console.log(
          "Tia TODO: display an error saying failed to fetch user data (res.data.error)"
        );
      }
    } catch (err) {
      console.log("err", err);
      if (err.response.status === 401 || err.response.status === 400) {
        navigate("/register");
      }
    }
  };

  useEffect(() => {
    fetchUserData();
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
              position="fixed"
              onPostCreated={fetchUserData}
            />
            <Box
              sx={{
                flex: 1,
                paddingLeft: "2vw",
                paddingRight: "2vw",
                paddingTop: "2vh",
                paddingBottom: "2vh",
                overflow: "auto",
              }}
            >
              {/* Here goes the profile stuff*/}
              <Stack spacing={5}>
                <Box>
                  <Box
                    bgcolor={"accent.main"}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      backgroundImage: `url(${headPhoto})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "10px",
                      minHeight: "20vh",
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Box sx={{ paddingLeft: "2vw", paddingBottom: "2vh" }}>
                        <Avatar
                          src={profileImage}
                          sx={{
                            width: 150,
                            height: 150,
                            border: "white 4px solid",
                            borderColor: "page.main",
                          }}
                        />
                      </Box>

                      {userId === localStorage.getItem("id") ? (
                        <Button
                          sx={{
                            position: "absolute",
                            bottom: "5px",
                            right: "5px",
                            bgcolor: "white",
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={handleOpen}
                        >
                          <EditIcon fontSize="large" sx={{ color: "black" }} />
                        </Button>
                      ) : null}
                    </Box>
                  </Box>
                  <Typography variant="h3" color={"text.main"}>
                    {userName}
                  </Typography>
                  <Typography variant="h6" color={"text.secondary"}>
                    {jobTitle}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h4">About Me</Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: "page.main",
                      height: "auto",
                      padding: "2vh 2vw 2vw 2vh",
                      borderRadius: "10px",
                    }}
                  >
                    <Typography color={"text.secondary"}>
                      {biography}
                    </Typography>
                  </Paper>
                </Box>

                <Box>
                  <Typography variant="h4">Posts</Typography>
                  <Stack spacing={3}>
                    {posts.map((post) => (
                      <Post
                        key={post._id}
                        _postId={post._id}
                        _userName={post.authorName}
                        _authorId={post.authorId}
                        _jobTitle={post.authorJobTitle}
                        _profilePhoto={profileImage}
                        _description={post.description}
                        _likes={post.likes}
                        _dislikes={post.dislikes}
                        _comments={post.comments}
                        _createdAt={post.createdAt}
                        _updatedAt={post.updatedAt}
                        onDeletePost={handlePostDelete}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>
        ) : (
          <Box>
            <MobileSideNav onPostCreated={fetchUserData} />
            <Box
              sx={{
                flex: 1,
                paddingLeft: "2vw",
                paddingRight: "2vw",
                paddingTop: "67px",
                paddingBottom: "2vh",
                overflow: "auto",
              }}
            >
              <Stack spacing={5}>
                <Box>
                  <Box
                    bgcolor={"accent.main"}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      backgroundImage: `url(${headPhoto})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "10px",
                      minHeight: "20vh",
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Box sx={{ paddingLeft: "2vw", paddingBottom: "2vh" }}>
                        <Avatar
                          src={profileImage}
                          sx={{
                            width: 150,
                            height: 150,
                            border: "white 4px solid",
                            borderColor: "page.main",
                          }}
                        />
                      </Box>

                      {userId === localStorage.getItem("id") ? (
                        <Button
                          sx={{
                            position: "absolute",
                            bottom: "5px",
                            right: "5px",
                            bgcolor: "white",
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={handleOpen}
                        >
                          <EditIcon fontSize="large" sx={{ color: "black" }} />
                        </Button>
                      ) : null}
                    </Box>
                  </Box>
                  <Typography variant="h3" color={"text.main"}>
                    {userName}
                  </Typography>
                  <Typography variant="h6" color={"text.secondary"}>
                    {jobTitle}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h4">About Me</Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: "page.main",
                      height: "auto",
                      padding: "2vh 2vw 2vw 2vh",
                      borderRadius: "10px",
                    }}
                  >
                    <Typography color={"text.secondary"}>
                      {biography}
                    </Typography>
                  </Paper>
                </Box>

                <Box>
                  <Typography variant="h4">Posts</Typography>
                  <Stack spacing={3}>
                    {posts.map((post) => (
                      <Post
                        key={post._id}
                        _postId={post._id}
                        _userName={post.authorName}
                        _authorId={post.authorId}
                        _jobTitle={post.authorJobTitle}
                        _profilePhoto={profileImage}
                        _description={post.description}
                        _likes={post.likes}
                        _dislikes={post.dislikes}
                        _comments={post.comments}
                        _createdAt={post.createdAt}
                        _updatedAt={post.updatedAt}
                        onDeletePost={handlePostDelete}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>
        )}

        <EditProfileModal
          open={open}
          handleClose={handleClose}
          handleSubmit={handleChange}
          formValues={formValues}
        />
        <Snackbar
          open={successVis}
          autoHideDuration={3000}
          onClose={handleSnackClose}
        >
          <Alert
            onClose={handleSnackClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Your profile was updated!
          </Alert>
        </Snackbar>
        <Footer />
      </ThemeProvider>
    </div>
  );
}

export default Profile;

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
  Menu,
  MenuItem,
} from "@mui/material";
import Post from "../../components/Post";
import EditIcon from "@mui/icons-material/Edit";

import axios from "axios";
import { useParams } from "react-router-dom";
import MobileSideNav from "../../components/Mobile/MobileSideNav";
import Footer from "../../components/Footer";
import EditProfileModal from "../../components/Modals/EditProfileModal";
import EditPhotoModal from "../../components/Modals/EditPhotoModal";
import ShowFollowingModal from "../../components/Modals/ShowFollowingModal";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function Profile() {
  const { profileid } = useParams();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [jobTitle, setJobTitle] = useState("New user");
  const [biography, setBiography] = useState(
    "There's no bio yet... Click the edit button to add one!"
  );
  const [posts, setPosts] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [headPhoto, setHeaderPhoto] = useState(
    "https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?cs=srgb&dl=pexels-chait-goli-1796730.jpg&fm=jpg"
  );
  const [formValues, setFormValues] = useState({
    name: "",
    bio: "",
    jobTitle: "",
  });
  const [openFollowingModal, setOpenFollowingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [successVis, setSuccessVis] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [editOpen, setEditOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleOpenEdit = () => setEditOpen(true);
  const handleCloseEdit = () => setEditOpen(false);
  const closeFollowingModal = () => setOpenFollowingModal(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleShowFollowingModal = () => {
    handleElClose();
    setOpenFollowingModal(true);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleElClose = () => {
    setAnchorEl(null);
  };

  const handleFileUpload = async (file) => {
    console.log("file:", file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `http://localhost:8000/api/users/profileImage`,
        formData, // Use the FormData object as the request data
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data", // Set the content type to 'multipart/form-data'
          },
        }
      );

      if (res.status === 201) {
        localStorage.setItem("profilePictureId", res.data.id);
        const profileImageFetch = await axios.get(
          `http://localhost:8000/api/users/profileImage/${res.data.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            responseType: "arraybuffer", // Set the responseType to arraybuffer
          }
        );

        if (
          profileImageFetch.status === 200 ||
          profileImageFetch.status === 304
        ) {
          // Create a blob from the file data
          const blob = new Blob([profileImageFetch.data], {
            type: profileImageFetch.headers["content-type"],
          });

          // Convert the blob to a URL (blob URL)
          const blobUrl = URL.createObjectURL(blob);
          setProfileImage(blobUrl);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
    }
  };

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

  const handleSubmit = async (e, values) => {
    console.log("HANDLE SUBMIT", values);

    // Make PUT request to update user data
    const res = await axios.put(
      `http://localhost:8000/api/users/${userId}`,
      values,
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
        res.data.error // change to snackbar
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
        const userPosts = res.data.userPosts;
        console.log("userPosts:", userPosts);
        setUserId(userData._id);
        setUserName(userData.name);
        setJobTitle(userData.jobTitle);
        setBiography(userData.bio);
        setPosts(userPosts);

        setFormValues({
          name: userData.name,
          jobTitle: userData.jobTitle,
          bio: userData.bio,
        });

        if (userData.profilePictureId !== "") {
          const profileImageFetch = await axios.get(
            `http://localhost:8000/api/users/profileImage/${userData.profilePictureId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              responseType: "arraybuffer", // Set the responseType to arraybuffer
            }
          );

          if (
            profileImageFetch.status === 200 ||
            profileImageFetch.status === 304
          ) {
            // Create a blob from the file data
            const blob = new Blob([profileImageFetch.data], {
              type: profileImageFetch.headers["content-type"],
            });

            // Convert the blob to a URL (blob URL)
            const blobUrl = URL.createObjectURL(blob);
            setProfileImage(blobUrl);
            setLoading(false);
          } else {
            console.log(
              "Tia TODO: display an error saying failed to fetch user data (res.data.error)"
            );
          }
        }
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

  // ARTEM TODO: both buttons are there but only show the relevant one.
  const handleFollow = () => {
    console.log("followed");
  };

  const handleUnfollow = () => {
    handleElClose();
    console.log("unfollowed");
  };

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
                          onClick={handleOpenEdit}
                        />
                      </Box>

                      {userId === localStorage.getItem("id") ? (
                        <Button
                          sx={{
                            position: "absolute",
                            bottom: "5px",
                            right: "5px",
                            bgcolor: "white",
                            width: "fit-content",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            padding: "0 10px",
                            color: "text.main",
                          }}
                          onClick={handleOpen}
                        >
                          <EditIcon
                            fontSize="small"
                            sx={{ color: "black", marginRight: "5px" }}
                          />
                          Edit Profile
                        </Button>
                      ) : null}
                    </Box>
                  </Box>
                  <Stack direction={"row"} justifyContent="space-between">
                    <Box>
                      <Typography variant="h3" color={"text.main"}>
                        {userName}
                      </Typography>
                      <Typography variant="h6" color={"text.secondary"}>
                        {jobTitle}
                      </Typography>
                    </Box>

                    <Box sx={{ ml: "auto", paddingTop: "2vh" }}>
                      <Button
                        variant="contained"
                        onClick={handleFollow}
                        sx={{
                          backgroundColor: "accent.main",
                          "&:hover": {
                            backgroundColor: "accent.secondary",
                          },
                        }}
                      >
                        Follow
                      </Button>
                      <Button
                        onClick={handleClick}
                        startIcon={<ArrowDropDownIcon />}
                        variant="contained"
                        sx={{
                          backgroundColor: "accent.main",
                          "&:hover": {
                            backgroundColor: "accent.secondary",
                          },
                        }}
                      >
                        Following
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleElClose}
                      >
                        <MenuItem onClick={handleShowFollowingModal}>
                          View Following
                        </MenuItem>
                        <MenuItem onClick={handleUnfollow}>Unfollow</MenuItem>
                      </Menu>
                    </Box>
                  </Stack>
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
                    {posts.map(
                      (post) =>
                        !loading && (
                          <Post
                            key={post._id}
                            _postId={post._id}
                            _userName={post.authorName}
                            _authorId={post.authorId}
                            _jobTitle={post.authorJobTitle}
                            _authorProfilePhoto={profileImage}
                            _description={post.description}
                            _likes={post.likes}
                            _dislikes={post.dislikes}
                            _comments={post.comments}
                            _createdAt={post.createdAt}
                            _updatedAt={post.updatedAt}
                            onDeletePost={handlePostDelete}
                          />
                        )
                    )}
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
                          onClick={handleOpenEdit}
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
                  <Stack direction={"row"} justifyContent="space-between">
                    <Box>
                      <Typography variant="h3" color={"text.main"}>
                        {userName}
                      </Typography>
                      <Typography variant="h6" color={"text.secondary"}>
                        {jobTitle}
                      </Typography>
                    </Box>

                    <Box sx={{ ml: "auto", paddingTop: "2vh" }}>
                      <Button
                        variant="contained"
                        onClick={handleFollow}
                        sx={{
                          backgroundColor: "accent.main",
                          "&:hover": {
                            backgroundColor: "accent.secondary",
                          },
                        }}
                      >
                        Follow
                      </Button>
                      <Button
                        onClick={handleClick}
                        startIcon={<ArrowDropDownIcon />}
                        variant="contained"
                        sx={{
                          backgroundColor: "accent.main",
                          "&:hover": {
                            backgroundColor: "accent.secondary",
                          },
                        }}
                      >
                        Following
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleElClose}
                      >
                        <MenuItem onClick={handleShowFollowingModal}>
                          View Following
                        </MenuItem>
                        <MenuItem onClick={handleUnfollow}>Unfollow</MenuItem>
                      </Menu>
                    </Box>
                  </Stack>
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
                    {posts.map(
                      (post) =>
                        !loading && (
                          <Post
                            key={post._id}
                            _postId={post._id}
                            _userName={post.authorName}
                            _authorId={post.authorId}
                            _jobTitle={post.authorJobTitle}
                            _authorProfilePhoto={profileImage}
                            _description={post.description}
                            _likes={post.likes}
                            _dislikes={post.dislikes}
                            _comments={post.comments}
                            _createdAt={post.createdAt}
                            _updatedAt={post.updatedAt}
                            onDeletePost={handlePostDelete}
                          />
                        )
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>
        )}

        <ShowFollowingModal
          open={openFollowingModal}
          handleClose={closeFollowingModal}
        />

        <EditPhotoModal
          open={editOpen}
          onClose={handleCloseEdit}
          onFileUpload={handleFileUpload}
        />
        <EditProfileModal
          open={open}
          handleClose={handleClose}
          initValues={formValues}
          handleSubmit={handleSubmit}
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

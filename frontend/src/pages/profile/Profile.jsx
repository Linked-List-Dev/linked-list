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
  IconButton,
  MenuItem,
  Backdrop,
  CircularProgress,
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
import FourOhFour from "../error/FourOhFour";
import Linkify from "../../util/Linkify";
import { useNavigate } from "react-router-dom";

function Profile() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { profileid } = useParams();
  const [profileId, setProfileId] = useState(profileid);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [jobTitle, setJobTitle] = useState("New user");
  const [biography, setBiography] = useState("");
  const [noPostsMsg, setNoPostsMsg] = useState(
    "You have no posts yet. Want to add one?"
  );
  const [noBioMsg, setNoBioMsg] = useState("")
  const [posts, setPosts] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState("");
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
  const [successProfileDataUpdateVis, setSuccessProfileDataUpdateVis] =
    useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [editOpen, setEditOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleOpenEdit = () => setEditOpen(true);
  const handleCloseEdit = () => setEditOpen(false);
  const closeFollowingModal = () => setOpenFollowingModal(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [profileNotFound, setProfileNotFound] = useState(false);

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

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
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/users/profileImage`,
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
          `${API_URL}/users/profileImage/${res.data.id}`,
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
          const commentProfilePictures = {};
          // Create a blob from the file data
          const blob = new Blob([profileImageFetch.data], {
            type: profileImageFetch.headers["content-type"],
          });

          // Convert the blob to a URL (blob URL)
          const blobUrl = URL.createObjectURL(blob);
          setProfileImage(blobUrl);
          setUserProfilePicture(blobUrl);

          for (const post of res.data.userPosts) {
            for (const comment of post.comments) {
              try {
                if (comment.authorProfilePictureId !== "") {
                  const res = await axios.get(
                    `${API_URL}/users/profileImage/${comment.authorProfilePictureId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                      responseType: "arraybuffer",
                    }
                  );

                  if (res.status === 200 || res.status === 304) {
                    const blob = new Blob([res.data], {
                      type: res.headers["content-type"],
                    });
                    const blobUrl = URL.createObjectURL(blob);
                    commentProfilePictures[comment.authorProfilePictureId] =
                      blobUrl;
                  }
                }
              } catch (err) {
                console.log(err);
                if (
                  err.response.status === 401 ||
                  err.response.status === 400
                ) {
                  navigate("/register");
                }
              }
            }
          }

          const postsWithCommentsWithProfilePictures = res.data.userPosts.map(
            (post) => ({
              ...post,
              comments: post.comments.map((comment) => ({
                ...comment,
                profilePicture:
                  commentProfilePictures[comment.authorProfilePictureId] || "",
              })),
            })
          );

          setPosts(postsWithCommentsWithProfilePictures);

          setSuccessProfileDataUpdateVis(true);
          setLoading(false);
          setEditOpen(false);
        }
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
      if (err.response.status === 401 || err.response.status === 400) {
        navigate("/register");
      }
    }
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessProfileDataUpdateVis(false);
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

  const handleProfileUpdate = async (e, values) => {
    setLoading(true);
    // Make PUT request to update user data
    const res = await axios.put(`${API_URL}/users/${userId}`, values, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("res.status:", res.status);
    if (res.status === 200) {
      // Update the state variables with the updated user data
      setUserName(res.data.name);
      setJobTitle(res.data.jobTitle);
      setBiography(res.data.bio);
      const commentProfilePictures = {};

      for (const post of res.data.userPosts) {
        for (const comment of post.comments) {
          try {
            if (comment.authorProfilePictureId != "") {
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
                commentProfilePictures[comment.authorProfilePictureId] =
                  blobUrl;
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

      const postsWithCommentsWithProfilePictures = res.data.userPosts.map(
        (post) => ({
          ...post,
          comments: post.comments.map((comment) => ({
            ...comment,
            profilePicture:
              commentProfilePictures[comment.authorProfilePictureId] || "",
          })),
        })
      );

      setPosts(postsWithCommentsWithProfilePictures);
      setLoading(false);
      setOpen(false);
      setSuccessProfileDataUpdateVis(true);
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

  const handlePostCreate = async (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  async function getProfile() {
    try {
      setLoading(true); // Start loading

      let profilePictureFetch = {};
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
      } else {
        setUserProfilePicture("")
        if (localStorage.getItem("id") === profileId) {
          setProfileImage("")
        }
      }

      if (
        profilePictureFetch.status === 200 ||
        profilePictureFetch.status === 304
      ) {
        // Create a blob from the file data
        const blob = new Blob([profilePictureFetch.data], {
          type: profilePictureFetch.headers["content-type"],
        });

        // Convert the blob to a URL (blob URL)
        const blobUrl = URL.createObjectURL(blob);
        setUserProfilePicture(blobUrl);
      }

      const res = await axios.get(`${API_URL}/users/${profileid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(res.status);
      if (res.status === 200 || res.status === 304) {
        const commentProfilePictures = {};
        const userData = res.data.user;
        const userPosts = res.data.userPosts;
        setUserId(userData._id);
        setUserName(userData.name);
        setJobTitle(userData.jobTitle);
        setBiography(userData.bio);

        for (const post of userPosts) {
          // Iterate through each comment in the post
          for (const comment of post.comments) {
            try {
              if (comment.authorProfilePictureId !== "") {
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
                  commentProfilePictures[comment.authorProfilePictureId] =
                    blobUrl;
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

        // Set the posts with the updated comment profile pictures
        const postsWithCommentsWithProfilePictures = userPosts.map((post) => ({
          ...post,
          comments: post.comments.map((comment) => ({
            ...comment,
            profilePicture:
              commentProfilePictures[comment.authorProfilePictureId] || "",
          })),
        }));

        setPosts(postsWithCommentsWithProfilePictures);

        setFormValues({
          name: userData.name,
          jobTitle: userData.jobTitle,
          bio: userData.bio,
        });

        if (userData.profilePictureId !== "") {
          const profileImageFetch = await axios.get(
            `${API_URL}/users/profileImage/${userData.profilePictureId}`,
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
      console.log("err", err.message);
      if (err.response.status === 401 || err.response.status === 400) {
        navigate("/register");
      } else { //404 or 500
        setProfileNotFound(true)
      }
    } finally {
      setLoading(false); // Stop loading after fetching data, regardless of success or error
    }
  }

  useEffect(() => {
    // on initial load
    getProfile();
  }, []);

  useEffect(() => {
    // Listen for changes in the profile ID
    if (profileid !== profileId) {
      setLoading(true);
      setProfileId(profileid);
    }
  }, [profileid]);

  useEffect(() => {
    // Fetch user data whenever the profile ID changes
    getProfile();
  }, [profileId]);

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
      {profileNotFound ? (
        <FourOhFour />
      ) : (
        <>
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
                    position="fixed"
                    onPostCreated={handlePostCreate}
                    _userProfilePicture={userProfilePicture}
                  />
                )}
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
                          backgroundColor: "accent.main",
                          borderRadius: "10px",
                          minHeight: "20vh",
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <Box sx={{ paddingLeft: "2vw", paddingBottom: "2vh" }}>
                            {userId === localStorage.getItem("id") ? (
                              <>
                                <Avatar
                                  src={profileImage}
                                  sx={{
                                    width: 150,
                                    height: 150,
                                    border: "white 4px solid",
                                    borderColor: "page.main",
                                    cursor: "pointer", // Set the cursor to "pointer" when hovering over the Avatar
                                    "&:hover": {
                                      // Add on-hover styles
                                      border: "white 4px solid",
                                      boxShadow:
                                        "0px 0px 5px 0px rgba(0, 0, 0, 0.75)",
                                    },
                                  }}
                                  onClick={handleOpenEdit}
                                />
                                <IconButton
                                  sx={{
                                    position: "absolute",
                                    bottom: 20,
                                    left: 140,
                                    bgcolor: "white",
                                    cursor: "pointer", // Set the cursor to "pointer" when hovering over the IconButton
                                    "&:hover": {
                                      // Add on-hover styles
                                      backgroundColor: "gray", // For example, change the background color on hover
                                    },
                                  }}
                                  onClick={handleOpenEdit}
                                >
                                  <EditIcon />
                                </IconButton>
                              </>
                            ) : (
                              <Avatar
                                src={profileImage}
                                sx={{
                                  width: 150,
                                  height: 150,
                                  border: "white 4px solid",
                                  borderColor: "page.main",
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Stack direction={"row"} justifyContent="space-between">
                        <Box>
                          <Typography variant="h3" color={"text.main"}>
                            {userName}
                          </Typography>
                          <Typography variant="h6" color={"text.secondary"}>
                            {userId === localStorage.getItem("id") ? (
                              <>
                                {jobTitle ? (
                                  <Box>
                                    {jobTitle}
                                  </Box>
                                ) : (
                                  <Box>
                                    You haven't shared your job yet...
                                  </Box>
                                )}
                              </>
                            ) : (
                              <>
                                {jobTitle ? (
                                  <Box>
                                    {jobTitle}
                                  </Box>
                                ) : (
                                  <Box>
                                    Looking for job
                                  </Box>
                                )}
                              </>
                            )}
                          </Typography>
                          <Box>
                            {/* <Stack direction={'row'} spacing={2}>
                          <Typography>Followers: {followers}</Typography>
                          <Typography>Following: {following}</Typography>
                        </Stack> */}
                          </Box>
                        </Box>

                        <Box sx={{ ml: "auto", paddingTop: "2vh" }}>
                          {
                            userId === localStorage.getItem("id") ? (
                              <Button
                                sx={{
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
                            ) : null
                            // <Box>
                            //   {" "}
                            //   <Button
                            //     variant="contained"
                            //     onClick={handleFollow}
                            //     sx={{
                            //       backgroundColor: "accent.main",
                            //       "&:hover": {
                            //         backgroundColor: "accent.secondary",
                            //       },
                            //     }}
                            //   >
                            //     Follow
                            //   </Button>
                            //   <Button
                            //     onClick={handleClick}
                            //     startIcon={<ArrowDropDownIcon />}
                            //     variant="contained"
                            //     sx={{
                            //       backgroundColor: "accent.main",
                            //       "&:hover": {
                            //         backgroundColor: "accent.secondary",
                            //       },
                            //     }}
                            //   >
                            //     Following
                            //   </Button>
                            //   <Menu
                            //     anchorEl={anchorEl}
                            //     open={Boolean(anchorEl)}
                            //     onClose={handleElClose}
                            //   >
                            //     <MenuItem onClick={handleShowFollowingModal}>
                            //       View Following
                            //     </MenuItem>
                            //     <MenuItem onClick={handleUnfollow}>
                            //       Unfollow
                            //     </MenuItem>
                            //   </Menu>
                            // </Box>
                          }
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
                          {userId === localStorage.getItem("id") ? (
                            <>
                              {biography ? (
                                <Linkify text={biography} />
                              ) : (
                                <Box>You haven't set your bio yet. Click the edit profile button to add one!</Box>
                              )}
                            </>
                          ) : (
                            <>
                              {biography ? (
                                <Linkify text={biography} />
                              ) : (
                                <Box>This user has no bio added yet.</Box>
                              )}
                            </>
                          )}

                        </Typography>
                      </Paper>
                    </Box>

                    <Box>
                      <Typography variant="h4">Posts</Typography>
                      <Stack spacing={3}>
                        {posts.length === 0 ? (
                          <Typography
                            variant="h5"
                            sx={{ position: "absolute", color: "text.secondary" }}
                          >
                            {noPostsMsg}
                          </Typography>
                        ) : null}
                        {posts
                          .sort(
                            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                          )
                          .map(
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
                  {posts.length === 0 ? (
                    <Box
                      sx={{
                        textAlign: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: "2vh",
                        color: "#cfcaca",
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        margin: 'auto',
                        width: '100vw',
                      }}
                    >
                      <Typography paddingTop={"2vh"}>
                        © {new Date().getFullYear()} Flores & Kolpakov. All rights reserved.
                      </Typography>
                    </Box>
                  ) : <Box
                    sx={{
                      textAlign: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingTop: "2vh",
                      color: "#cfcaca",
                    }}
                  >
                    <Typography paddingTop={"2vh"}>
                      © {new Date().getFullYear()} Flores & Kolpakov. All rights
                      reserved.
                    </Typography>
                  </Box>}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  backgroundColor: "page.secondary",
                  height: "100vh",
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
                    paddingTop: "67px",
                    paddingBottom: "2vh",
                    overflow: "auto",
                    backgroundColor: "page.secondary",
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
                          backgroundColor: "accent.main",
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
                            <IconButton
                              sx={{
                                position: "absolute",
                                bottom: 20,
                                left: 120,
                                bgcolor: "white",
                              }}
                              onClick={handleOpenEdit}
                            >
                              <EditIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                      <Stack direction={"row"} justifyContent="space-between">
                        <Box>
                          <Typography variant="h3" color={"text.main"}>
                            {userName}
                          </Typography>
                          <Typography variant="h6" color={"text.secondary"}>
                            {userId === localStorage.getItem("id") ? (
                              <>
                                {jobTitle ? (
                                  <Box>
                                    {jobTitle}
                                  </Box>
                                ) : (
                                  <Box>
                                    You haven't shared your job yet...
                                  </Box>
                                )}
                              </>
                            ) : (
                              <>
                                {jobTitle ? (
                                  <Box>
                                    {jobTitle}
                                  </Box>
                                ) : (
                                  <Box>
                                    Looking for job
                                  </Box>
                                )}
                              </>
                            )}
                          </Typography>
                        </Box>

                        <Box sx={{ ml: "auto", paddingTop: "2vh" }}>
                          {userId === localStorage.getItem("id") ? (
                            <Button
                              sx={{
                                bgcolor: "white",
                                width: "fit-content",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                padding: "0 10px",
                                color: "text.main",
                                whiteSpace: "nowrap",
                              }}
                              onClick={handleOpen}
                            >
                              <EditIcon
                                fontSize="small"
                                sx={{ color: "black", marginRight: "5px" }}
                              />
                              Edit Profile
                            </Button>
                          ) : (null
                            // <Box>
                            //   {" "}
                            //   <Button
                            //     variant="contained"
                            //     onClick={handleFollow}
                            //     sx={{
                            //       backgroundColor: "accent.main",
                            //       "&:hover": {
                            //         backgroundColor: "accent.secondary",
                            //       },
                            //     }}
                            //   >
                            //     Follow
                            //   </Button>
                            //   <Button
                            //     onClick={handleClick}
                            //     startIcon={<ArrowDropDownIcon />}
                            //     variant="contained"
                            //     sx={{
                            //       backgroundColor: "accent.main",
                            //       "&:hover": {
                            //         backgroundColor: "accent.secondary",
                            //       },
                            //     }}
                            //   >
                            //     Following
                            //   </Button>
                            //   <Menu
                            //     anchorEl={anchorEl}
                            //     open={Boolean(anchorEl)}
                            //     onClose={handleElClose}
                            //   >
                            //     <MenuItem onClick={handleShowFollowingModal}>
                            //       View Following
                            //     </MenuItem>
                            //     <MenuItem onClick={handleUnfollow}>
                            //       Unfollow
                            //     </MenuItem>
                            //   </Menu>
                            // </Box>
                          )}
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
                          {userId === localStorage.getItem("id") ? (
                            <>
                              {biography ? (
                                <Linkify text={biography} />
                              ) : (
                                <Box>You haven't set your bio yet. Click the edit profile button to add one!</Box>
                              )}
                            </>
                          ) : (
                            <>
                              {biography ? (
                                <Linkify text={biography} />
                              ) : (
                                <Box>This user has no bio added yet.</Box>
                              )}
                            </>
                          )}
                        </Typography>
                      </Paper>
                    </Box>

                    <Box>
                      <Typography variant="h4">Posts</Typography>
                      <Stack spacing={3}>
                        {posts.length === 0 ? (
                          <Typography
                            variant="h5"
                            sx={{ position: "absolute", color: "text.secondary" }}
                          >
                            {noPostsMsg}
                          </Typography>
                        ) : null}
                        {posts
                          .sort(
                            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                          )
                          .map(
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


                  {posts.length === 0 ? (
                    <Box
                      sx={{
                        width: '100vw',
                        textAlign: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: "2vh",
                        color: "#cfcaca",
                        position: 'absolute',
                        bottom: 0,
                      }}
                    >
                      <Typography paddingTop={"2vh"}>
                        © {new Date().getFullYear()} Flores & Kolpakov. All rights
                        reserved.
                      </Typography>
                    </Box>
                  ) : <Box
                    sx={{
                      width: '100vw',
                      textAlign: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingTop: "2vh",
                      color: "#cfcaca",
                    }}
                  >
                    <Typography paddingTop={"2vh"}>
                      © {new Date().getFullYear()} Flores & Kolpakov. All rights
                      reserved.
                    </Typography>
                  </Box>}

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
              onProfileUpdate={handleProfileUpdate}
            />
            <Snackbar
              open={successProfileDataUpdateVis}
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
          </ThemeProvider>
        </>
      )}
    </div>
  );
}

export default Profile;

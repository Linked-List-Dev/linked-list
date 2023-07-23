import React, { useState, useEffect } from 'react';
import NavigationSidePanel from "../../components/NavigationSidePanel";
import AppTheme from "../../util/Theme";
import {
  Box,
  Typography,
  ThemeProvider,
  Stack,
  Paper,
  Avatar,
  Button,
  TextField,
  Modal,
} from "@mui/material";
import Post from "../../components/Post";
import EditIcon from "@mui/icons-material/Edit";
import axios from 'axios';

function Profile() {
  const [userName, setUserName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [biography, setBiography] = useState("");
  const [posts, setPosts] = useState([]);
  const [profileImage, setProfileImage] = useState("https://www.catster.com/wp-content/uploads/2017/11/Mackerel-Tabby-cat.jpg.optimal.jpg");
  const [headPhoto, setHeaderPhoto] = useState("https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?cs=srgb&dl=pexels-chait-goli-1796730.jpg&fm=jpg");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    try {
      const res = await axios.put(
        `http://localhost:8000/api/users/${localStorage.getItem('id')}`,
        formValues,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log("res.status:", res.status)
      if (res.status === 200) {
        // Update the state variables with the updated user data
        setUserName(res.data.name);
        setJobTitle(res.data.jobTitle);
        setBiography(res.data.bio);
        // Tia TODO: close the modal and clear the input values
        setOpen(false)
      } else {
        console.log("Tia TODO: display an error saying failed to update user info (res.data.error)");
      }
    } catch (err) {
      console.log("err:", err.message)
      console.log("Tia TODO: display an error saying failed to update user info");
    }
  };

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        console.log("")
        const res = await axios.get(`http://localhost:8000/api/users/${localStorage.getItem('id')}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (res.status === 200) {
          const userData = res.data.user;
          setUserName(userData.name);
          setJobTitle(userData.jobTitle);
          setBiography(userData.bio);
          setPosts(userData.posts);
        } else {
          console.log("Tia TODO: display an error saying failed to fetch user data");
        }
      } catch (err) {
        console.log("Tia TODO: display an error saying failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <Box sx={{ display: "flex", backgroundColor: "page.secondary" }}>
          <NavigationSidePanel position="fixed" />
  
          <Box
            sx={{
              flex: 1,
              paddingLeft: "2vw",
              paddingRight: "2vw",
              paddingTop: "2vh",
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
                  <Typography color={"text.secondary"}>{biography}</Typography>
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
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>
  
          <Modal
            open={open}
            onClose={handleClose}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor: "page.main",
                borderRadius: 5,
                width: "40vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Box paddingTop="3vh" paddingBottom="3vh">
                <Stack
                  spacing={5}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  paddingTop="2vh"
                  paddingBottom="2vh"
                >
                  <form onSubmit={handleSubmit}>
                    <Stack alignItems={"center"} spacing={3}>
                      <Typography variant="h3" color="accent.main">
                        Edit Profile
                      </Typography>
                      <TextField
                        sx={{ width: "30vw" }}
                        variant="outlined"
                        name="name"
                        label="Display Name"
                        value={formValues.name}
                        onChange={handleChange}
                        fullWidth
                      />

                      <TextField
                        sx={{ width: "30vw" }}
                        variant="outlined"
                        name="jobTitle"
                        label="Job Title"
                        value={formValues.jobTitle}
                        onChange={handleChange}
                        fullWidth
                      />

                      <TextField
                        sx={{ width: "30vw" }}
                        rows={5}
                        variant="outlined"
                        name="bio"
                        label="Biography"
                        value={formValues.bio}
                        onChange={handleChange}
                        multiline
                        fullWidth
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                          backgroundColor: "accent.main",
                          textTransform: "none",
                          width: "auto",
                          height: "auto",
                          "&:hover": {
                            backgroundColor: "accent.secondary",
                          },
                        }}
                      >
                        <Typography variant="h4">Save changes</Typography>
                      </Button>
                    </Stack>
                  </form>
                </Stack>
              </Box>
            </Box>
          </Modal>
        </Box>
      </ThemeProvider>
    </div>
  );  
}

export default Profile;

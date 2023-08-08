import React, { useState, useEffect } from "react";
import LinkedListLogoLight from "../assets/LinkedListLogoLight.svg";
import AppTheme from "../util/Theme";
import {
  TextField,
  Stack,
  ThemeProvider,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Modal,
  Box,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import NewPostModal from "./Modals/NewPostModal";
import SettingsModal from "./Modals/SettingsModal";
import Feed from "../pages/feed/Feed";
import Footer from "./Footer";

function NavigationSidePanel({ onPostCreated, _userProfilePicture }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [successVis, setSuccessVis] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const openSettingsModal = () => setSettingsOpen(true);
  const closeSettingsModal = () => setSettingsOpen(false);
  const [profileImage, setProfileImage] = useState(_userProfilePicture);

  const navigate = useNavigate();

  const getFirstLetter = () => {
    const userName = localStorage.getItem("username");
    return userName ? userName[0] : "";
  };

  const [formValues, setFormValues] = useState({
    content: "",
  });

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessVis(false);
  };

  const handleLogOut = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("id", "");
    localStorage.setItem("email", "");
    localStorage.setItem("username", "");
    localStorage.setItem("profilePictureId", "");
    navigate("/");
  };

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

    const res = await axios.post(
      `${API_URL}/posts/`,
      { description: formValues.content }, // Request payload
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(res.status);
    if (res.status === 200) {
      // console.log("response: ", res.data.id)
      // return res.data.id;
      onPostCreated(res.data.createdPost);
      setOpen(false);
      setSuccessVis(true);
      formValues.content = "";
    } else {
      console.log("err.message:", res.data.error);
      // Tia TODO: display the error
    }
  };

  const handleProfileButtonClick = () => {
    const profileId = localStorage.getItem("id");
    navigate(`/profile/${profileId}`);
  };

  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <Box height={"100vh"}>
          <Stack
            sx={{
              backgroundColor: "page.main",
              height: "100vh",
              paddingTop: "2vh"
            }}
          >
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                justifyContent: "center", // Align horizontally to center
                alignItems: "center", // Align vertically to center
              }}
            >
              <img
                src={LinkedListLogoLight}
                height={"45vh"}
                sx={{ paddingRight: "2", paddingLeft: "2" }}
              />
            </Box>

            <List>
              <ListItem>
                <ListItemButton component={Link} to="/feed">
                  <ListItemIcon>
                    <HomeIcon fontSize="large" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="h4">Home</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>

              <ListItem>
                <ListItemButton onClick={handleOpen}>
                  <ListItemIcon>
                    <AddBoxIcon fontSize="large" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="h4">New Post</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>

              <ListItem>
                <ListItemButton onClick={handleProfileButtonClick}>
                  <ListItemIcon>
                    <Avatar
                      alt="Profile Picture"
                      src={profileImage} // Set the source of the image to the blobUrl
                      sx={{ bgcolor: "accent.main" }}
                    >
                      {profileImage ? null : getFirstLetter()}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="h4">Profile</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>

              <ListItem onClick={openSettingsModal}>
                <ListItemButton>
                  <ListItemIcon>
                    <SettingsIcon fontSize="large" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="h4">Settings</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
            
          </Stack>
        </Box>

        <NewPostModal
          open={open}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          formValues={formValues}
        />

        <SettingsModal
          settingsOpen={settingsOpen}
          closeSettingsModal={closeSettingsModal}
          handleLogOut={handleLogOut}
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
            Your post was successfully created!
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </div>
  );
}

export default NavigationSidePanel;

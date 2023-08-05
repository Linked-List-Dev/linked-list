import React, { useState } from "react";
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  ListItemText,
  Avatar,
  Snackbar,
  Alert, Typography,
  ListItem,
  ListItemButton, ListItemIcon,
  List,
  Box,
  Stack
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@emotion/react";
import AppTheme from "../../util/Theme";
import IconDark from "../../assets/IconDark.svg";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SettingsIcon from "@mui/icons-material/Settings";
import axios from "axios";
import NewPostModal from "../Modals/NewPostModal";
import SettingsModal from "../Modals/SettingsModal";

function MobileSideNav({ onPostCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [successVis, setSuccessVis] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const openSettingsModal = () => setSettingsOpen(true);
  const closeSettingsModal = () => setSettingsOpen(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessVis(false);
  };

  const [formValues, setFormValues] = useState({
    content: "",
  });

  const handleLogOut = () => {
    //Artem to do log out
  };
  const handleDeleteAccount = () => {
    console.log("deleting account");
    //artem to do delete account and redirect user to the landing page
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
      "http://localhost:8000/api/posts/",
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
      onPostCreated();
      setOpen(false);
      setSuccessVis(true);
      formValues.content = "";
    } else {
      console.log("err.message:", res.data.error);
      // Tia TODO: display the error
    }
  };

  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <AppBar position="fixed" sx={{ backgroundColor: "accent.secondary" }}>
          <Toolbar>
            <Box component={Link} to="/">
              <img src={IconDark} height={"50vh"} />
            </Box>
            <div style={{ marginLeft: "auto" }}>
              <IconButton edge="start" aria-label="menu" onClick={toggleDrawer}>
                <MenuIcon fontSize="large" />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer anchor="top" open={isOpen} onClose={toggleDrawer}>
          <div
            role="presentation"
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
          >
            <Stack>
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
                  <ListItemButton
                    component={Link}
                    to={`/profile/${localStorage.getItem("id")}`}
                  >
                    <ListItemIcon>
                      {/*ARTEM TODO GET IMAGE FROM USER CAN USE SRC*/}
                      <Avatar sx={{ bgcolor: "accent.main" }}>A</Avatar>
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
          </div>
        </Drawer>

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

export default MobileSideNav;

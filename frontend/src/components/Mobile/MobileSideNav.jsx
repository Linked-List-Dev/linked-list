import React, { useState } from "react";
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  ListItemText,
  Avatar,
  Snackbar,
  Alert,
  Button,
  Typography,
  ListItem,
  ListItemButton,
  Modal,
  ListItemIcon,
  TextField,
  List,
  Box,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@emotion/react";
import AppTheme from "../../util/Theme";
import IconDark from "../../assets/IconDark.svg";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios"

function MobileSideNav({ onPostCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successVis, setSuccessVis] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const openSettingsModal = () => setSettingsOpen(true);
  const closeSettingsModal = () => setSettingsOpen(false);
  const closeConfirmationModal = () => setConfirmOpen(false);

  const openConfirmationModal = () => {
    setSettingsOpen(false) 
    setConfirmOpen(true)
};


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
      setSuccessVis(true)
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

        <Modal
          open={open}
          onClose={handleClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
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
              "@media (max-width: 768px)": {
                width: "70vw",
              }
            }}
          >
            <Box paddingTop="3vh" paddingBottom="3vh" sx={{"@media (max-width: 768px)": {
                    width: "70vw",
                  }}}>
              <Stack
                spacing={5}
                direction="row"
                alignItems="center"
                justifyContent="center"
                paddingTop="2vh"
                paddingBottom="2vh"
                
              >
                <form onSubmit={handleSubmit} >
                  <Stack alignItems={"center"} spacing={3} sx={{"@media (max-width: 768px)": {
                    width: "60vw",
                  }}}>
                    <Typography variant="h3" color="accent.main">
                      New Post
                    </Typography>
                    <TextField
                      multiline
                      rows={5}
                      variant="outlined"
                      name="content"
                      label="What's on your mind?"
                      value={formValues.content}
                      onChange={handleChange}
                      fullWidth
                      required
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: "accent.main",
                        textTransform: "none",
                        borderRadius: 4,
                        width: "7vw",
                        height: "auto",
                        "&:hover": {
                          backgroundColor: "accent.secondary",
                        },
                        whiteSpace: "nowrap",
                        "@media (max-width: 768px)": {
                            width: "auto",
                          }
                      }}
                    >
                      <Typography variant="h4">Post!</Typography>
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Box>
          </Box>

          
        </Modal>

        <Modal
          open={settingsOpen}
          onClose={closeSettingsModal}
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
              "@media (max-width: 768px)": {
                width: "70vw",
              }
            }}
          >
            <Box paddingTop="3vh" paddingBottom="3vh">
              <Stack
                spacing={5}
                alignItems="center"
                justifyContent="center"
                paddingTop="2vh"
                paddingBottom="2vh"
              >
                <Typography variant="h3" color="accent.main">
                  Settings
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    width: "20vw",
                    backgroundColor: "accent.main",
                    "&:hover": {
                      backgroundColor: "accent.secondary",
                    },
                    "@media (max-width: 768px)": {
                        width: "50vw",
                      }
                  }}
                  onClick={handleLogOut}
                >
                  Log Out
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  sx={{ width: "20vw", whiteSpace: "nowrap","@media (max-width: 768px)": {
                    width: "50vw",
                  } }}
                  onClick={openConfirmationModal}
                >
                  Delete Account
                </Button>
              </Stack>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={confirmOpen}
          onClose={closeConfirmationModal}
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
              "@media (max-width: 768px)": {
                width: "70vw",
              }
            }}
          >
            <Stack
              paddingTop={"2vh"}
              paddingBottom={"2vh"}
              alignItems="center"
              justifyContent="center"
              spacing={5}
            >
              <Stack>
                <Typography variant="h3">Delete Account</Typography>
                <Typography>
                  Are you sure you want to do this? This action is not
                  reversable.
                </Typography>
              </Stack>
              <Button
                variant="outlined"
                color="error"
                size="large"
                sx={{ width: "20vw", whiteSpace: "nowrap", "@media (max-width: 768px)": {
                    width: "50vw",
                  } }}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </Stack>
          </Box>
        </Modal>

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

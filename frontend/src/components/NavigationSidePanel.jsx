import * as React from "react";
import { useState } from "react";
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

function NavigationSidePanel({ onPostCreated }) {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const openSettingsModal = () => setSettingsOpen(true);
  const closeSettingsModal = () => setSettingsOpen(false);
  const openConfirmationModal = () => setConfirmOpen(true);
  const closeConfirmationModal = () => setConfirmOpen(false);

  const navigate = useNavigate();

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

    try {
      const res = await axios.post(
        "http://localhost:8000/api/posts/",
        { description: formValues.content }, // Request payload
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        // console.log("response: ", res.data.id)
        // return res.data.id;
        onPostCreated();
        setOpen(false);
        formValues.content = "";
      } else {
        console.log("err.message:", res.data.error);
        // Tia TODO: display err.response.data
      }
    } catch (err) {
      console.log("err.message:", err.message);
      // Tia TODO: display err.response.data
    }
  };

  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <Box height={"100vh"}>
          <Stack
            sx={{
              backgroundColor: "page.main",
              height: "100vh",
              paddingTop: "2vh",
            }}
          >
            <Box component={Link} to="/">
              <img src={LinkedListLogoLight} height={"50vh"} />
            </Box>

            <TextField
              id="input-with-icon-textfield"
              variant="filled"
              sx={{
                paddingLeft: "2vw",
                paddingRight: "2vw",
                paddingTop: "2vh",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

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
                <ListItemButton component={Link} to="/profile">
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
                      New Post
                    </Typography>
                    <TextField
                      sx={{ width: "30vw" }}
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
                  }}
                  onClick={handleLogOut}
                >
                  Log Out
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  sx={{ width: "20vw" }}
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
                sx={{ width: "20vw" }}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </Stack>
          </Box>
        </Modal>
      </ThemeProvider>
    </div>
  );
}

export default NavigationSidePanel;

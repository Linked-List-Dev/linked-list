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

function NavigationSidePanel({ onPostCreated }) {
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
    setSettingsOpen(false);
    setConfirmOpen(true);
  };

  const navigate = useNavigate();

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
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    const res = await axios.delete(
      `http://localhost:8000/api/users/${localStorage.getItem("id")}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(res.status);
    if (res.status === 204) {
      // Tia TODO: create a popup saying that the user got deleted successfully
    } else {
      console.log(
        "Tia TODO: display an error saying failed to delete a post (res.data.error)"
      );
    }

    localStorage.setItem("token", "");
    localStorage.setItem("id", "");
    localStorage.setItem("email", "");
    localStorage.setItem("username", "");
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
                    <Avatar sx={{ bgcolor: "accent.main" }}>
                      {" "}
                      {localStorage.getItem("username")[0]}{" "}
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
          openConfirmationModal={openConfirmationModal}
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

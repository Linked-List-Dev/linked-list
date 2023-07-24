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
import LinkedListLogoLight from "../../assets/LinkedListLogoLight.svg";

function MobileNav() {
  return (
    <div>
      <Box width={"100vw"}>
      <Stack
        alignContent="center"
        justifyContent="center" // Add justifyContent to center horizontally
        textAlign="center"
      >
        <img src={LinkedListLogoLight} height={"70vh"} />
        <Typography variant="h4">About</Typography>
        <Typography variant="h4">Contribution</Typography>
        <Button
          variant="outlined"
          size="large"
          sx={{
            color: "accent.main",
            borderRadius: 4,
            borderWidth: 3,
            borderColor: "accent.main",
            width: "8vw",
            height: "auto",
            textAlign: "center",
            textTransform: "none",
          }}
          component={Link}
          to="/login"
        >
          <Typography variant="h5">Sign In</Typography>
        </Button>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "accent.main",
            borderRadius: 4,
            width: "8vw",
            height: "70px",
            textAlign: "center",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "accent.secondary",
            },
          }}
          component={Link}
          to="/register"
        >
          <Typography variant="h5">Sign Up</Typography>
        </Button>
      </Stack>
    </Box>
    </div>
  );
}

export default MobileNav;

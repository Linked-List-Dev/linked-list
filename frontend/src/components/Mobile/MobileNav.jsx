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
  Paper,
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
        <ThemeProvider theme={AppTheme}>
        <Box width={"100vw"}>
      <Stack
        alignContent="center"
        justifyContent="center" 
        textAlign="center"
      >
        <Box>
        <img src={LinkedListLogoLight} height={"70vh"} />
        </Box>
        
        <Box>
            <Button
          variant="outlined"
          size="large"
          sx={{
            color: "accent.main",
            borderRadius: 1,
            borderWidth: 3,
            borderColor: "accent.main",
            width: "100vw",
            height: "70px",
            textAlign: "center",
            textTransform: "none",
            whiteSpace: "nowrap"
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
            borderRadius: 1,
            width: "100vw",
            height: "70px",
            textAlign: "center",
            textTransform: "none",
            whiteSpace: "nowrap",
            "&:hover": {
              backgroundColor: "accent.secondary",
            },
          }}
          component={Link}
          to="/register"
        >
          <Typography variant="h5">Sign Up</Typography>
        </Button>
        
        </Box>
        
      </Stack>
    </Box>
        </ThemeProvider>
      
    </div>
  );
}

export default MobileNav;

import React from "react";
import { useState } from "react";
import { ThemeProvider, Typography, Button, Box, Snackbar, Alert } from "@mui/material";
import AppTheme from "../util/Theme";
import { Link } from "react-router-dom";
import IconDark from "../assets/IconDark.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignInModal from "./Modals/SignInModal";

function LoginSide({ openByDefault }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [open, setOpen] = useState(openByDefault);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [loginFailedVis, setLoginFailedVis] = useState(false);
  const [loginSucceededVis, setLoginSucceededVis] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const loginFailedVisClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setLoginFailedVis(false);
  };

  const handleSubmit = async (e) => {
    console.log(formValues);
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/users/login`, {
        email: formValues.email,
        password: formValues.password,
      });

      if (res.status === 200) {
        console.log(
          "Logged in a user, user's id and token are:",
          res.data.id,
          res.data.token
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("username", res.data.name);
        localStorage.setItem("profilePictureId", res.data.profileImageId);

        setLoginSucceededVis(true);

        setTimeout(() => {
          navigate("/feed");
        }, 1200);
      }
    } catch (err) {
      e.preventDefault();
      console.log("err.response:", err.response)
      setLoginFailedVis(true)
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={AppTheme}>
      <Box
        sx={{
          background: "linear-gradient(to top, #9398FC, #6858D8)",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            paddingLeft: "2vw",
            paddingTop: "2vh",
          }}
        >
          <Link to="/">
            <img src={IconDark} alt="Icon" />
          </Link>
        </Box>

        <Box
          sx={{
            width: "50vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",

            "@media (max-width: 768px)": {
              width: "100vw",
            },
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              paddingLeft: "5vw",
              paddingRight: "5vw",
            }}
          >
            <Typography variant="h1">Welcome Back!</Typography>
            <Typography variant="h4" sx={{ paddingBottom: "2vh" }}>
              To keep connected with us please log in with your account
              information.
            </Typography>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: "white",
                borderColor: "accent.secondary",
                textTransform: "none",
                borderRadius: 4,
                borderWidth: 3,
                width: "15vw",
                height: "auto",
                whiteSpace: "nowrap",
                "@media (max-width: 768px)": {
                  width: "auto",
                },
              }}
              onClick={handleOpen}
            >
              <Typography variant="h4">Sign In</Typography>
            </Button>
          </Box>
        </Box>

        <SignInModal
          open={open}
          handleClose={handleClose}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formValues={formValues}
        />
      </Box>

      <Snackbar
        open={loginFailedVis}
        autoHideDuration={3000}
        onClose={loginFailedVisClose}
      >
        <Alert
          onClose={loginFailedVisClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          You have entered invalid authentication credentials! Try again...
        </Alert>
      </Snackbar>

      <Snackbar
        open={loginSucceededVis}
        autoHideDuration={1200}
      >
        <Alert
          severity="success"
          sx={{ width: "100%" }}
        >
          You have logged in successfully!
        </Alert>
      </Snackbar>

    </ThemeProvider>
  );
}

export default LoginSide;

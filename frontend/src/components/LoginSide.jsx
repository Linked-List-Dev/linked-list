import React from "react";
import { useState } from "react";
import { ThemeProvider, Typography, Button, Box } from "@mui/material";
import AppTheme from "../util/Theme";
import { Link } from "react-router-dom";
import IconDark from "../assets/IconDark.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignInModal from "./Modals/SignInModal";

function LoginSide({ openByDefault }) {
  const [open, setOpen] = useState(openByDefault);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log(formValues);
    e.preventDefault();
    const res = await axios.post("http://localhost:8000/api/users/login", {
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

      navigate("/feed");
      // TODO:
      // setTimeout(() => {
      //   setMessage('User logged in successfully');
      //   navigate('/feed');
      // }, 2000);
    } else {
      console.log("res.data.error:", res.data.error);
      setError(res.data.error);
    }
  };

  const handleResetError = () => {
    setError("");
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
          error={error}
          open={open}
          handleClose={handleClose}
          handleChange={handleChange}
          handleResetError={handleResetError}
          handleSubmit={handleSubmit}
          formValues={formValues}
        />
      </Box>
    </ThemeProvider>
  );
}

export default LoginSide;

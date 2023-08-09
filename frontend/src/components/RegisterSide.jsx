import React from "react";
import { useState } from "react";
import {
  ThemeProvider,
  Typography,
  Button,
  Box,
  TextField,
  Stack,
  Snackbar,
  Alert
} from "@mui/material";
import AppTheme from "../util/Theme";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterSide() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [registrationFailedVis, setRegistrationFailedVis] = useState(false);
  const [registrationSucceededVis, setRegistrationSucceededVis] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log(
      formValues,
      formValues.password === formValues.confirmPassword,
      typeof formValues.password,
      typeof formValues.confirmPassword
    );

    if (formValues.password === formValues.confirmPassword) {
      e.preventDefault();
      console.log("formValues:", formValues);

      try {
        const res = await axios.post(`${API_URL}/users`, {
          name: formValues.name,
          email: formValues.email,
          password: formValues.confirmPassword,
        });

        if (res.status === 201) {
          console.log("Created new user, navigate to the posts page (TODO)");
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("id", res.data.id);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("username", res.data.name);
          localStorage.setItem("profilePictureId", res.data.profileImageId);

          setRegistrationSucceededVis(true);

          setTimeout(() => {
            navigate("/feed");
          }, 1200);
        }
      } catch (err) {
        console.log("err.response:", err.response)
        e.preventDefault();
        setRegistrationFailedVis(true)
      }
    } else {
      e.preventDefault();
      setError("Passwords do not match");
    }
  };

  const handleResetError = () => {
    setError("");
  };

  const registrationFailedVisClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setRegistrationFailedVis(false);
  };

  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <Box
          sx={{
            backgroundColor: "page.main",
            position: "relative",
            //overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              width: "50vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.main",
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
              <Typography
                variant="h1"
                color={"accent.main"}
                sx={{ paddingBottom: "2vh" }}
              >
                Create Account
              </Typography>
              <Typography
                variant="h5"
                sx={{ paddingBottom: "2vh", paddingTop: "2vh" }}
              >
                Use your email for registration
              </Typography>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3} sx={{ paddingBottom: 3 }}>
                  <TextField
                    variant="outlined"
                    name="name"
                    label="Name"
                    value={formValues.name}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <TextField
                    variant="outlined"
                    name="email"
                    label="Email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <TextField
                    variant="outlined"
                    name="password"
                    label="Password"
                    type="password"
                    value={formValues.password}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <TextField
                    variant="outlined"
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={Boolean(error)}
                    helperText={error}
                    onFocus={handleResetError}
                  />
                </Stack>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "accent.main",
                    textTransform: "none",
                    borderRadius: 4,
                    width: "15vw",
                    height: "auto",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      backgroundColor: "accent.secondary",
                    },
                    "@media (max-width: 768px)": {
                      width: "auto",
                    },
                  }}
                >
                  <Typography variant="h4">Sign Up</Typography>
                </Button>
              </form>
            </Box>
          </Box>
        </Box>

        <Snackbar
          open={registrationFailedVis}
          autoHideDuration={8000}
          onClose={registrationFailedVisClose}
        >
          <Alert
            onClose={registrationFailedVisClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            Something went wrong when creating your account. This email might already be used by someone! Try again...
          </Alert>
        </Snackbar>

        <Snackbar
          open={registrationSucceededVis}
          autoHideDuration={1200}
        >
          <Alert
            severity="success"
            sx={{ width: "100%" }}
          >
            You have successfully registered and logged in!
          </Alert>
        </Snackbar>

      </ThemeProvider>
    </div>
  );
}

export default RegisterSide;

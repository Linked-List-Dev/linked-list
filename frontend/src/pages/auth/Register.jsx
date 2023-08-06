import React from "react";
import LoginSide from "../../components/LoginSide";
import RegisterSide from "../../components/RegisterSide";
import { ThemeProvider, Box } from "@mui/material";
import AppTheme from "../../util/Theme";
import Footer from "../../components/Footer";

function Register({ openModal }) {
  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <Box
          sx={{
            display: "flex",
            width: "100vw",
            overflow: 'scroll',
            maxHeight: '100vh',
            // Add media query to stack components at 100vw on small screens
            "@media (max-width: 768px)": {
              flexDirection: "column",
              alignContent: "center",
              textAlign: "center",
              overflow: 'scroll',
            },
          }}
        >
          <LoginSide openByDefault={openModal} />
          <RegisterSide />
        </Box>
        <Footer />
      </ThemeProvider>
    </div>
  );
}

export default Register;

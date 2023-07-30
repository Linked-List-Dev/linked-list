import React from "react";
import { Button, Typography, Box, Stack } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import AppTheme from "../../util/Theme";
import { Link } from "react-router-dom";
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
                  whiteSpace: "nowrap",
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

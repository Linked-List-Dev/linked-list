import { Box, Button, Stack, ThemeProvider, Typography } from "@mui/material";
import React from "react";
import AppTheme from "../../util/Theme";
import LinkedListLogo from "../../assets/IconLight.svg";
import { Link } from "react-router-dom";

function FourOhFour() {
  return (
    <ThemeProvider theme={AppTheme}>
      <Box>
        <Box
          sx={{ position: "absolute" }}
          paddingTop={"3vh"}
          paddingLeft={"3vw"}
        >
          <img src={LinkedListLogo} />
        </Box>
        <Box
          height={"100vh"}
          backgroundColor={"page.secondary"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box textAlign={"center"}>
            <Stack spacing={3}>
              <Typography variant="h2" color={"accent.secondary"}>
                Page not found
              </Typography>
              <Typography variant="h4">
                Looks like the page you were looking for does not exist.
              </Typography>
              <Button
                component={Link}
                to="/feed"
                variant="outlined"
                sx={{
                  color: "accent.main",
                  borderColor: "accent.main",
                  mx: "auto",
                  "&:hover": { borderColor: "accent.secondary" },
                }}
              >
                Back to your feed
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default FourOhFour;

import React from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import AppTheme from "../util/Theme";

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <Box
          position="static"
          sx={{ top: "auto", bottom: 0, backgroundColor: "accent.main", width: '100vw' }}
        >
          <Toolbar>
            <Typography
              variant="body1"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              © {currentYear} Flores & Kolpakov. All rights reserved.
            </Typography>
          </Toolbar>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default Footer;

import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import AppTheme from "../util/Theme";

function Footer() {
  return (
    <div>
      <ThemeProvider theme={AppTheme}>
      <AppBar position="static" sx={{ top: "auto", bottom: 0, backgroundColor: 'accent.main' }}>
      <Toolbar>
        <Typography variant="body1" sx={{ flexGrow: 1, textAlign: "center" }}>
          © 2023 LinkedList. All rights reserved.
        </Typography>
      </Toolbar>
    </AppBar>
      </ThemeProvider>
    </div>
    
  );
}

export default Footer;

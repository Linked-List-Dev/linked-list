import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  ThemeProvider,
  Stack,
  Paper,
  Avatar,
  Card,
  CardContent,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "react-router-dom";
import AppTheme from "../util/Theme";

function FollowerCard({ name }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleShowFollowingModal = () => {
    handleElClose();
    setOpenFollowingModal(true);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleElClose = () => {
    setAnchorEl(null);
  };

  const handleFollow = () => {
    console.log("followed");
  };

  const handleUnfollow = () => {
    handleElClose();
    console.log("unfollowed");
  };

  return (
    <ThemeProvider theme={AppTheme}>
      <Box>
        <Card>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction={"row"} spacing={1}>
                <Box
                  component={Link}
                  to="/feed"
                  sx={{ textTransform: "none", textDecoration: "none", color: 'text.main' }}
                >
                  <Avatar sx={{ width: 40, height: 40 }}>{name[0]}</Avatar>
                </Box>

                <Box
                  component={Link}
                  to="/feed"
                  sx={{ textTransform: "none", textDecoration: "none", color: 'text.main' }}
                >
                  <Typography variant="h6">{name}</Typography>
                </Box>
              </Stack>

              <Box>
                <Button
                  variant="contained"
                  onClick={handleFollow}
                  sx={{
                    backgroundColor: "accent.main",
                    "&:hover": {
                      backgroundColor: "accent.secondary",
                    },
                  }}
                >
                  Follow
                </Button>
                <Button
                  onClick={handleClick}
                  startIcon={<ArrowDropDownIcon />}
                  variant="contained"
                  sx={{
                    backgroundColor: "accent.main",
                    "&:hover": {
                      backgroundColor: "accent.secondary",
                    },
                  }}
                >
                  Following
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleElClose}
                >
                  <MenuItem onClick={handleUnfollow}>Unfollow</MenuItem>
                </Menu>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default FollowerCard;

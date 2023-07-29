import React from "react";
import {
  Typography,
  Button,
  Box,
  Modal,
  Stack,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function SignInModal({
  open,
  handleClose,
  handleSubmit,
  handleChange,
  handleResetError,
  formValues,
  error,
}) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
        
        
      <Box
        sx={{
          backgroundColor: "page.main",
          borderRadius: 10,
          width: "40vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "@media (max-width: 768px)": {
            width: "auto",
            paddingLeft: "3vw",
            paddingRight: "3vw",
          },
        }}
      >
        <Box
          paddingTop="3vh"
          paddingBottom="3vh"
          width={"40vw"}
          sx={{
            "@media (max-width: 768px)": {
              width: "auto",
            },
          }}
        >
            
        
          <Typography
            color="accent.main"
            variant="h1"
            sx={{ whiteSpace: "nowrap" }}
          >
            Sign In
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack
              spacing={3}
              sx={{
                paddingBottom: 3,
                paddingTop: "2vh",
                paddingRight: "2vw",
                paddingLeft: "2vw",
              }}
            >
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
                width: "auto",
                height: "80px",
                "&:hover": {
                  backgroundColor: "accent.secondary",
                },
                color: "text.main",
                whiteSpace: "nowrap",
                "@media (max-width: 768px)": {
                  width: "auto",
                },
              }}
            >
              <Typography variant="h4">Sign In</Typography>
            </Button>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}

export default SignInModal;

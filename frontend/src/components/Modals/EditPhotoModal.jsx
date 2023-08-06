import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Input,
  ThemeProvider,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AppTheme from "../../util/Theme";

function EditPhotoModal({ open, onClose, onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorOpen, setErrorOpen] = useState(false)

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setErrorOpen(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase()

      if (fileExtension === 'jpeg' || fileExtension === 'jpg' || fileExtension === 'png'){
        onFileUpload(selectedFile);
        setSelectedFile(null);
      } else {
        setErrorOpen(true)
      }
    }
  };

  return (
    <ThemeProvider theme={AppTheme}>
      <Modal
        open={open}
        onClose={onClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "page.main",
            borderRadius: 5,
            width: "40vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            "@media (max-width: 768px)": {
              width: "70vw",
            },
          }}
        >
          <Box
            paddingTop="3vh"
            paddingBottom="3vh"
            sx={{
              "@media (max-width: 768px)": {
                width: "70vw",
              },
            }}
          >
            <Stack spacing={2}>
              <Box>
                <Typography variant="h3" color="accent.main">
                  Change Profile Photo
                </Typography>
              </Box>

              <Box>
                <label htmlFor="file-input">
                  <Box
                    border={1}
                    borderColor={selectedFile ? "green" : "primary.main"}
                    borderRadius="borderRadius"
                    p={2}
                    textAlign="center"
                    component="div"
                    paddingLeft={"2vw"}
                    paddingRight={"2vw"}
                  >
                    <Input
                      id="file-input"
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      inputProps={{ "aria-label": "Upload file" }}
                    />
                    <CloudUploadIcon fontSize="large" />
                    {selectedFile ? (
                      <p>File uploaded: {selectedFile.name}</p>
                    ) : (
                      <p>Click anywhere to upload a file</p>
                    )}
                  </Box>
                </label>
              </Box>

              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "accent.main",
                    textTransform: "none",
                    width: "auto",
                    height: "auto",
                    "&:hover": {
                      backgroundColor: "accent.secondary",
                    },
                  }}
                  onClick={handleUpload}
                >
                  <Typography variant="h4">Save changes</Typography>
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Modal>

      <Snackbar
          open={errorOpen}
          autoHideDuration={3000}
          onClose={handleSnackClose}
        >
          <Alert
            onClose={handleSnackClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            Invalid photo type. Must be jpeg, jpg, or png.
          </Alert>
        </Snackbar>
    </ThemeProvider>
  );
}

export default EditPhotoModal;

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  Modal,
} from "@mui/material";

function EditProfileModal({ open, handleClose, onProfileUpdate, initValues }) {
  const [formValues, setFormValues] = useState("");

  useEffect(() => {
    setFormValues(initValues);
  }, [initValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const localSubmit = (e) => {
    e.preventDefault();
    onProfileUpdate(e, formValues);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
          <Stack
            spacing={5}
            direction="row"
            alignItems="center"
            justifyContent="center"
            paddingTop="2vh"
            paddingBottom="2vh"
          >
            <form onSubmit={localSubmit}>
              <Stack alignItems={"center"} spacing={3} width={"30vw"}>
                <Typography variant="h3" color="accent.main">
                  Edit Profile
                </Typography>
                <TextField
                  variant="outlined"
                  name="name"
                  label="Display Name"
                  value={formValues.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                <TextField
                  variant="outlined"
                  name="jobTitle"
                  label="Job Title"
                  value={formValues.jobTitle}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  rows={5}
                  variant="outlined"
                  name="bio"
                  label="Biography"
                  value={formValues.bio}
                  onChange={handleChange}
                  multiline
                  fullWidth
                />

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
                >
                  <Typography variant="h4">Save changes</Typography>
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditProfileModal;

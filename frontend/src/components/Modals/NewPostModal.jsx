import React, { useState, useEffect } from "react";
import {
  TextField,
  Stack,
  Typography,
  Modal,
  Box,
  Button,
  InputAdornment,
} from "@mui/material";

function NewPostModal({
  open,
  handleClose,
  handleSubmit,
  handleChange,
  formValues,
}) {
  const charLimit = 450;

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
        }}
      >
        <Box paddingTop="3vh" paddingBottom="3vh">
          <Stack
            spacing={5}
            direction="row"
            alignItems="center"
            justifyContent="center"
            paddingTop="2vh"
            paddingBottom="2vh"
          >
            <form onSubmit={handleSubmit}>
              <Stack alignItems={"center"} spacing={3}>
                <Typography variant="h3" color="accent.main">
                  New Post
                </Typography>

                <Box>
                  <TextField
                    sx={{ width: "30vw" }}
                    multiline
                    rows={5}
                    variant="outlined"
                    name="content"
                    label="What's on your mind?"
                    value={formValues.content}
                    inputProps={{ maxLength: charLimit }}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <Typography
                    textAlign={"right"}
                    color={
                      formValues.content.length === 450
                        ? "error"
                        : "textSecondary"
                    }
                    sx={{ position: "absolute" }}
                  >
                    {formValues.content.length}/450
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "accent.main",
                    textTransform: "none",
                    borderRadius: 4,
                    width: "auto",
                    height: "auto",
                    "&:hover": {
                      backgroundColor: "accent.secondary",
                    },
                  }}
                >
                  <Typography variant="h4">Post!</Typography>
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

export default NewPostModal;

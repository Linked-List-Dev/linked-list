import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import {
  Button,
  TextField,
  ThemeProvider,
  Alert,
  Typography,
  Stack,
  CardContent,
  Snackbar,
  Modal,
  Box,
} from "@mui/material";
import AppTheme from "../../util/Theme";
import axios from "axios";

function EditPost({ _content, _postId, _open, _handleClose, onUpdatePostDescription }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [content, setContent] = useState(_content);
  const [open, setOpen] = useState(_open);
  const [successVis, setSuccessVis] = useState(false);
  const [postId, setpostId] = useState(_postId);
  const charLimit = 450;

  const handleSubmit = async (e) => {
    if (!content) {
      // if the user sets the message to empty
      // todo warning here...
    }

    // TODO update the post
    const res = await axios.put(
      `${API_URL}/posts/${postId}`,
      { description: content },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    
    console.log(res.status);
    if (res.status === 200) {
      // Update the state variable with the updated user data
      onUpdatePostDescription(res.data.post.description);
    } else {
      console.log(
        "Tia TODO: display an error saying failed to update post (res.data.error)"
      );
      return;
    }

    setSuccessVis(true);

    _handleClose();
  };

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessVis(false);
  };

  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <Modal
          open={_open}
          onClose={_handleClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card
            sx={{
              backgroundColor: "page.main",
              borderRadius: 2,
              width: "40vw",
              "@media (max-width: 768px)": {
                width: "auto",
              },
            }}
          >
            <Stack>
              <Box>
                <CardContent>
                  <Stack alignItems={"center"} spacing={3}>
                    <Typography
                      variant="h3"
                      color="accent.main"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      Edit Your Post
                    </Typography>
                    <Box>
                    <TextField
                      sx={{
                        width: "30vw",
                        "@media (max-width: 768px)": {
                          width: "50vw",
                        },
                      }}
                      multiline
                      rows={5}
                      variant="outlined"
                      name="content"
                      label="What's on your mind?"
                      value={content}
                      inputProps={{ maxLength: charLimit }}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                    <Typography
                    textAlign={"right"}
                    color={
                      content.length === 450
                        ? "error"
                        : "textSecondary"
                    }
                    sx={{ position: "absolute" }}
                  >
                    {content.length}/450
                  </Typography>
                    </Box>
                    

                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: "accent.main",
                        textTransform: "none",
                        borderRadius: 4,
                        width: "7vw",
                        height: "auto",
                        "&:hover": {
                          backgroundColor: "accent.secondary",
                        },
                        whiteSpace: "nowrap",
                        "@media (max-width: 768px)": {
                          width: "auto",
                        },
                      }}
                    >
                      <Typography variant="h4">Save</Typography>
                    </Button>
                  </Stack>
                </CardContent>
              </Box>
            </Stack>
          </Card>
        </Modal>
        <Snackbar
          open={successVis}
          autoHideDuration={3000}
          onClose={handleSnackClose}
        >
          <Alert
            onClose={handleSnackClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Post saved successfully!
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </div>
  );
}

export default EditPost;

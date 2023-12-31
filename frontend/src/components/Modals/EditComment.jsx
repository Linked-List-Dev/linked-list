import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import {
  Button,
  TextField,
  CardActions,
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
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import IosShareIcon from "@mui/icons-material/IosShare";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

function EditComment({
  _content,
  _commentId,
  _open,
  _handleClose,
  onUpdateComment,
}) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [content, setContent] = useState(_content);
  const [open, setOpen] = useState(_open);
  const [successVis, setSuccessVis] = useState(false);
  const [commentId, setCommentId] = useState(_commentId);

  const handleSubmit = async (e) => {
    // edit comment

    if (!content) {
      return;
      // if the user sets the message to empty
      // todo warning here...
    }

    const res = await axios.put(
      `${API_URL}/posts/comment/${commentId}`,
      { newCommentContent: content },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("res.status:", res.status);
    if (res.status === 200) {
      // Update the state variable with the updated user data
      onUpdateComment(res.data.updatedComment.content);
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
                      Edit Comment
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
                        onChange={handleChange}
                        inputProps={{ maxLength: 450 }}
                        fullWidth
                        required
                      />
                      <Typography
                        textAlign={"right"}
                        color={
                          content.length === 450 ? "error" : "textSecondary"
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
            Comment updated successfully!
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </div>
  );
}

export default EditComment;

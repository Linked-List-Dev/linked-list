import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  CardActions,
  ThemeProvider,
  Avatar,
  Typography,
  Stack,
  CardContent,
  Divider,
  Modal,
  Box,
  IconButton,
} from "@mui/material";
import AppTheme from "../../util/Theme";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import axios from "axios";
import Comment from "../Comment";
import Linkify from "../../util/Linkify";
import { Link } from "react-router-dom";

function ExpandedPost({
  _authorId,
  _postId,
  _content,
  _userName,
  _jobTitle,
  _profilePhoto,
  _likes,
  _dislikes,
  _comments,
  _updatedAt,
  open,
  handleClose,
  handleLike,
  handleDislike,
  onUpdatePostComments
}) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [authorId, setAuthorId] = useState(_authorId);
  const [content, setContent] = useState(_content);
  const [userName, setUserName] = useState(_userName);
  const [jobTitle, setJobTitle] = useState(_jobTitle);
  const [profilePhoto, setProfilePhoto] = useState(_profilePhoto);
  const [postId, setpostId] = useState(_postId);
  const [comments, setComments] = useState(_comments);
  const [likes, setLikes] = useState(_likes);
  const [dislikes, setDislikes] = useState(_dislikes);
  const [commentContent, setCommentContent] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [message, setMessage] = useState(
    "There are no comments yet. Would you like to add one?"
  );
  const [successCreateCommentVis, setSuccessCreateCommentVis] = useState(false);
  const [successDeleteCommentVis, setSuccessDeleteCommentVis] = useState(false);

  const fetchProfilePicture = async (profilePictureId) => {
    if (profilePictureId !== "") {
      try {
        const res = await axios.get(
          `${API_URL}/users/profileImage/${profilePictureId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            responseType: "arraybuffer",
          }
        );
    
        if (res.status === 200) {
          const blob = new Blob([res.data], {
            type: res.headers["content-type"],
          });
          return URL.createObjectURL(blob);
        } else {
          // Tia TODO: handle error
          console.log("Error fetching profile picture");
          return null;
        }
      } catch (err) {
        console.error("Error fetching profile picture:", err);
        // Tia TODO: handle error
        return null;
      }
    } else {
      return ""
    }
  };
  
  useEffect(() => {
    setContent(_content);
  }, [_content]);

  useEffect(() => {
    setLikes(_likes);
  }, [_likes]);

  useEffect(() => {
    setDislikes(_dislikes);
  }, [_dislikes]);

  useEffect(() => {
    if (_updatedAt) {
      // Parse the input timestamp to a JavaScript Date object
      const dateObject = new Date(_updatedAt);

      // Format the date to "dd:mm" (day and month)
      const formattedDate = dateObject.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      setUpdatedAt(formattedDate);
    }
  }, [_updatedAt]);

  const handleCreateComment = async (e) => {
    e.preventDefault()

    const res = await axios.post(
      `${API_URL}/posts/comment`,
      {
        commentContent: commentContent,
        postId: postId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(res.status);
    if (res.status === 200) {
      const newComment = {
        ...res.data.comment,
        profilePicture: await fetchProfilePicture(res.data.comment.authorProfilePictureId),
      };

      // Spread the old comments and append the new comment to the comments array
      const updatedComments = [...comments, newComment];
      
      setComments(updatedComments);
      onUpdatePostComments(updatedComments);
      setSuccessCreateCommentVis(true);
      setCommentContent("");
    } else {
      console.log("err.message:", res.data.error);
      // Tia TODO: display response error
    }
  };

  const handleLikeFromExpanded = async (e) => {
    const res = await handleLike();
    setLikes(res.likes);
    setDislikes(res.dislikes);
  };

  const handleDislikeFromExpanded = async (e) => {
    const res = await handleDislike();
    setLikes(res.likes);
    setDislikes(res.dislikes);
  };

  const handleCommentDelete = (commentId) => {
    // Remove the deleted comment from the comments array in the state
    const newComments = comments.filter((comment) => comment._id !== commentId);
    setComments(newComments);
    onUpdatePostComments(newComments);
    setSuccessDeleteCommentVis(true);
  };

  const handleCommentUpdate = (commentId, newContent) => {
    // Update the content of the specific comment in the comments array in the state
    const updatedComments = comments.map((comment) =>
        comment._id === commentId ? { ...comment, content: newContent } : comment
    );
    setComments(updatedComments);
    onUpdatePostComments(updatedComments);
  };

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleCreateCommentSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessCreateCommentVis(false);
  };

  const handleDeleteCommentSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessDeleteCommentVis(false);
  };

  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <Modal
          open={open}
          onClose={handleClose}
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
                width: "70vw",
              },
            }}
          >
            <Stack>
              <Box>
                <CardContent>
                  <Stack direction={"row"} spacing={2} paddingBottom={"1vh"}>
                      <IconButton
                        component={Link}
                        to={`/profile/${authorId}`}
                      >
                        <Avatar src={profilePhoto} sx={{ width: 60, height: 60 }}>
                          {profilePhoto ? null : userName[0]}
                        </Avatar>
                      </IconButton>
                    <Stack>
                      <Typography variant="h5">{userName}</Typography>
                      <Typography
                        variant="body1"
                        component="div"
                        style={{ verticalAlign: "sub" }}
                      >
                        {jobTitle}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="h5">
                    <Linkify text={content}/>
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Button
                      size="small"
                      onClick={handleLikeFromExpanded}
                      sx={{ color: "accent.main" }}
                    >
                      {likes.includes(localStorage.getItem("email")) ? (
                        <ThumbUpAltIcon />
                      ) : (
                        <ThumbUpOffAltIcon />
                      )}
                      {likes.length}
                    </Button>
                    <Button
                      size="small"
                      onClick={handleDislikeFromExpanded}
                      sx={{ color: "accent.main" }}
                    >
                      {dislikes.includes(localStorage.getItem("email")) ? (
                        <ThumbDownAltIcon />
                      ) : (
                        <ThumbDownOffAltIcon />
                      )}
                      {dislikes.length}
                    </Button>
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {updatedAt}
                  </Typography>
                </CardActions>
              </Box>

              <Box
                sx={{
                  textAlign: "center",
                  alignItems: "center",
                  backgroundColor: "page.secondary",
                  paddingBottom: "1vh",
                  color: "text.primary",
                }}
              >
                <Divider sx={{ fontFamily: "Lato" }} />

                {comments.length === 0 ? (
                  <Box
                    height={"100px"}
                    paddingTop={"2vh"}
                    paddingLeft={"2vw"}
                    paddingRight={"2vw"}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: "text.secondary",
                        textAlign: "center",
                      }}
                    >
                      {message}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "text.secondary",
                        textAlign: "left",
                        paddingLeft: "1vw",
                        paddingTop: "1vh",
                      }}
                    >
                      Comments
                    </Typography>
                    <Stack
                      paddingTop={"1vh"}
                      sx={{ maxHeight: "50vh", overflow: "auto" }}
                    >
                      {comments.map((comment) => (
                        <Comment
                          key={comment._id}
                          _key={comment._id}
                          _content={comment.content}
                          _authorId={comment.authorId}
                          _authorName={comment.authorName}
                          _createdAt={comment.createdAt}
                          _updatedAt={comment.updatedAt}
                          _profilePhoto={comment.profilePicture}
                          onCommentDelete={handleCommentDelete}
                          onCommentUpdate={handleCommentUpdate}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <Divider sx={{ fontFamily: "Lato" }} />
                <form onSubmit={handleCreateComment}>
                <Stack direction={"row"}>
                  <TextField
                    variant="filled"
                    label="Add comment"
                    fullWidth
                    onChange={handleCommentChange}
                    value={commentContent}
                  />
                  <Button
                  type="submit"
                    variant="contained"
                    disableElevation
                    sx={{
                      backgroundColor: "accent.main",
                      "&:hover": {
                        backgroundColor: "accent.secondary",
                      },
                    }}
                  >
                    Comment
                  </Button>
                </Stack>
                </form>
                
              </Box>
            </Stack>
          </Card>
        </Modal>
        <Snackbar
          open={successCreateCommentVis}
          autoHideDuration={3000}
          onClose={handleCreateCommentSnackClose}
        >
          <Alert
            onClose={handleCreateCommentSnackClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Comment created successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={successDeleteCommentVis}
          autoHideDuration={3000}
          onClose={handleDeleteCommentSnackClose}
        >
          <Alert
            onClose={handleDeleteCommentSnackClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Comment deleted successfully!
          </Alert>
        </Snackbar>

      </ThemeProvider>
    </div>
  );
}

export default ExpandedPost;

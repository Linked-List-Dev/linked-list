import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import {
  Button,
  TextField,
  CardActions,
  ThemeProvider,
  Avatar,
  Typography,
  Stack,
  CardContent,
  Divider,
  Modal,
  Box,
} from "@mui/material";
import AppTheme from "../../util/Theme";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import axios from "axios";
import Comment from "../Comment";
import Linkify from "../../util/Linkify";

function ExpandedPost({
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
}) {
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
    console.log(commentContent);

    const res = await axios.post(
      "http://localhost:8000/api/posts/comment",
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
      setComments(res.data.post.comments);
      // setOpen(false);
      // setSuccessVis(true)
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
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
  };

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
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
                    <Avatar src={profilePhoto} sx={{ width: 60, height: 60 }}>
                      A
                    </Avatar>
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
                          _profilePhoto={comment.authorProfilePictureId}
                          onCommentDelete={handleCommentDelete}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <Divider sx={{ fontFamily: "Lato" }} />
                <Stack direction={"row"}>
                  <TextField
                    variant="filled"
                    label="Add comment"
                    fullWidth
                    onChange={handleCommentChange}
                    value={commentContent}
                  />
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      backgroundColor: "accent.main",
                      "&:hover": {
                        backgroundColor: "accent.secondary",
                      },
                    }}
                    onClick={handleCreateComment}
                  >
                    Comment
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Card>
        </Modal>
      </ThemeProvider>
    </div>
  );
}

export default ExpandedPost;

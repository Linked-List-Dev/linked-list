import * as React from "react";
import { useState, useEffect, useRef } from "react";
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
import AppTheme from "../util/Theme";
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
import Comment from "./Comment";

function ExpandedPost({
  _postId,
  _content,
  _userName,
  _jobTitle,
  _profilePhoto,
  _likes,
  _dislikes,
  _comments,
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


  useEffect(() => {
    setContent(_content);
  }, [_content]);

  useEffect(() => {
    setLikes(_likes);
  }, [_likes]);

  useEffect(() => {
    setDislikes(_dislikes);
  }, [_dislikes]);

  const handleCreateComment = async (e) => {
    console.log(commentContent);

    const res = await axios.post(
      "http://localhost:8000/api/posts/comment",
      {
        commentContent: commentContent,
        postId: postId
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(res.status);
    if (res.status === 200) {
      setComments(res.data.post.comments)
      // setOpen(false);
      // setSuccessVis(true)
      setCommentContent("");
    } else {
      console.log("err.message:", res.data.error);
      // Tia TODO: display response error
    }
  };

  const handleLikeFromExpanded = async (e) => {
    const res = await handleLike()
    setLikes(res.likes)
    setDislikes(res.dislikes)
  }

  const handleDislikeFromExpanded = async (e) => {
    const res = await handleDislike()
    setLikes(res.likes)
    setDislikes(res.dislikes)
  }
  
  const handleChange = (e) => {
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
              }
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
                  <Typography variant="h5">{content}</Typography>
                </CardContent>
                <CardActions>
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
                <Stack paddingTop={"1vh"} sx={{ maxHeight: '50vh',overflow: 'auto'}}>
                  {comments.map((comment) => (
                    <Comment
                      key={comment._id}
                      _content={comment.content}
                      _authorId={comment.authorId}
                      _authorName={comment.authorName}
                      _createdAt={comment.createdAt}
                      _updatedAt={comment._updatedAt}
                    />
                  ))}
                </Stack>
                <Divider sx={{ fontFamily: "Lato" }} />
                <Stack direction={"row"}>
                  <TextField
                    variant="filled"
                    label="Add comment"
                    fullWidth
                    onChange={handleChange}
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

import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import {
  Button,
  CardActionArea,
  CardActions,
  ThemeProvider,
  Avatar,
  Typography,
  Stack,
  CardContent,
  IconButton, Box
} from "@mui/material";
import AppTheme from "../util/Theme";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import ExpandedPost from "./Modals/ExpandedPost";
import EditPost from "./Modals/EditPost";
import { Link } from "react-router-dom";
import Linkify from '../util/Linkify'

function Post({
  _postId,
  _userName,
  _jobTitle,
  _authorProfilePhoto,
  _description,
  _likes,
  _dislikes,
  _authorId,
  _comments,
  onDeletePost,
  _createdAt,
  _updatedAt,
}) {
  const [postId, setPostId] = useState(_postId); // may be used for expanded view later...
  const [userName, setUserName] = useState(_userName);
  const [jobTitle, setJobTitle] = useState(_jobTitle);
  const [authorProfilePhoto, setAuthorProfilePhoto] = useState(_authorProfilePhoto);
  const [description, setDescription] = useState(_description);
  const [likes, setLikes] = useState(_likes);
  const [dislikes, setDislikes] = useState(_dislikes);
  const [authorId, setAuthorId] = useState(_authorId);
  const [comments, setComments] = useState(_comments);
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleComment = () => {
    setOpen(true);
  };

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteClick = async (e) => {
    const res = await axios.delete(
      `http://localhost:8000/api/posts/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(res.status);
    if (res.status === 204) {
      // Tia TODO: create a popup saying that the post got deleted successfully
      onDeletePost(postId);
    } else {
      console.log(
        "Tia TODO: display an error saying failed to delete a post (res.data.error)"
      );
    }

    e.stopPropagation();
  };

  async function handleLike() {
    if (!likes.includes(localStorage.getItem("email"))) {
      if (dislikes.includes(localStorage.getItem("email"))) {
        //if its disliked and they like do +2 instead of +1
        const res = await axios.post(
          "http://localhost:8000/api/posts/like/",
          {
            postId: postId,
            isLiked: false,
            isDisliked: true,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.status === 200) {
          // Update the likes state
          setLikes(res.data.likes);
          // Update the dislikes state
          setDislikes(res.data.dislikes);
          return { likes: res.data.likes, dislikes: res.data.dislikes };
        } else {
          console.log("err.message:", res.data.error);
        }
      } else {
        //if its not disliked and they like do +1
        const res = await axios.post(
          "http://localhost:8000/api/posts/like/",
          {
            postId: postId,
            isLiked: false,
            isDisliked: false,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.status === 200) {
          // Update the likes state
          setLikes(res.data.likes);
          // Update the dislikes state
          setDislikes(res.data.dislikes);
          return { likes: res.data.likes, dislikes: res.data.dislikes };
        } else {
          console.log("err.message:", res.data.error);
        }
      }
    } else {
      //if its liked and they like again do -1
      const res = await axios.post(
        "http://localhost:8000/api/posts/like/",
        {
          postId: postId,
          isLiked: true,
          isDisliked: false,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        // Update the likes state
        setLikes(res.data.likes);
        // Update the dislikes state
        setDislikes(res.data.dislikes);
        return { likes: res.data.likes, dislikes: res.data.dislikes };
      } else {
        console.log("err.message:", res.data.error);
      }
    }
  }

  async function handleDislike() {
    if (!dislikes.includes(localStorage.getItem("email"))) {
      if (likes.includes(localStorage.getItem("email"))) {
        //if its liked and they dislike do -2 instead of -1
        const res = await axios.post(
          "http://localhost:8000/api/posts/dislike/",
          {
            postId: postId,
            isLiked: true,
            isDisliked: false,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.status === 200) {
          // Update the likes state
          setLikes(res.data.likes);
          // Update the dislikes state
          setDislikes(res.data.dislikes);
          return { likes: res.data.likes, dislikes: res.data.dislikes };
        } else {
          console.log("err.message:", res.data.error);
        }
      } else {
        //if its not liked and they dislike do -1
        const res = await axios.post(
          "http://localhost:8000/api/posts/dislike/",
          {
            postId: postId,
            isLiked: false,
            isDisliked: false,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.status === 200) {
          // Update the likes state
          setLikes(res.data.likes);
          // Update the dislikes state
          setDislikes(res.data.dislikes);
          return { likes: res.data.likes, dislikes: res.data.dislikes };
        } else {
          console.log("err.message:", res.data.error);
        }
      }
    } else {
      //if its disliked and they disliked again do +1
      const res = await axios.post(
        "http://localhost:8000/api/posts/dislike/",
        {
          postId: postId,
          isLiked: false,
          isDisliked: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        // Update the likes state
        setLikes(res.data.likes);
        // Update the dislikes state
        setDislikes(res.data.dislikes);
        return { likes: res.data.likes, dislikes: res.data.dislikes };
      } else {
        console.log("err.message:", res.data.error);
      }
    }
  }

  const handleDescriptionUpdate = (newDescription) => {
    // Remove the deleted post from the posts array in the state
    setDescription(newDescription);
  };

  const handleCommentsUpdate = (newComments) => {
    setComments(newComments);
  };

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

  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <Card sx={{ bgcolor: "page.main" }}>
          <div style={{ position: "relative", zIndex: 999 }}>
            {authorId.toString() === localStorage.getItem("id") ? ( //only author can edit/delete their posts
              <>
                <IconButton
                  onClick={(event) => handleDeleteClick(event)}
                  style={{ position: "absolute", top: "10px", right: "10px" }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  onClick={handleEditOpen}
                  style={{ position: "absolute", top: "10px", right: "50px" }}
                >
                  <EditIcon />
                </IconButton>
              </>
            ) : null}
          </div>
          <div style={{ position: "relative", zIndex: 999 }}>
            <IconButton
              style={{ position: "absolute", top: "10px", left: "10px" }}
              component={Link}
              to={`/profile/${authorId}`}
            >
              <Avatar src={authorProfilePhoto} sx={{ width: 60, height: 60 }} />
            </IconButton>
          </div>
          <CardActionArea onClick={() => handleOpen()}>
            <CardContent style={{ position: "relative" }}>
              <Stack
                direction={"row"}
                spacing={2}
                paddingBottom={"1vh"}
                paddingLeft={"70px"}
              >
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

              <Typography variant="h6" color="text.secondary">
                <Linkify text={description}/>
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              size="small"
              onClick={handleLike}
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
              onClick={handleDislike}
              sx={{ color: "accent.main" }}
            >
              {dislikes.includes(localStorage.getItem("email")) ? (
                <ThumbDownAltIcon />
              ) : (
                <ThumbDownOffAltIcon />
              )}
              {dislikes.length}
            </Button>
            <Button sx={{ color: "accent.main" }} onClick={handleComment}>
              <CommentIcon /> {comments.length}
            </Button>
            <Box sx={{width: '100vw', textAlign: 'right'}}>
            <Typography
              variant="caption"
              sx={{
                position: "relative",

                color: "text.secondary",
              }}
            >
              {updatedAt}
            </Typography>
            </Box>
            
          </CardActions>
        </Card>
        <Box>
          <ExpandedPost
            _authorId={authorId}
            _postId={postId}
            _content={description}
            _userName={userName}
            _jobTitle={jobTitle}
            _profilePhoto={authorProfilePhoto}
            _likes={likes}
            _dislikes={dislikes}
            _comments={comments}
            _updatedAt={_updatedAt}
            open={open}
            handleClose={handleClose}
            handleDislike={handleDislike}
            handleLike={handleLike}
            onUpdatePostComments={handleCommentsUpdate}
          />
          <EditPost
            _content={description}
            _open={editOpen}
            _handleClose={handleEditClose}
            _postId={postId}
            onUpdatePostDescription={handleDescriptionUpdate}
          />
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default Post;

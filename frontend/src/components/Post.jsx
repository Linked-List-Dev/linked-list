import * as React from "react";
import { useState } from "react";
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
  IconButton,
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
import ExpandedPost from "./ExpandedPost";

function Post({
  _postId,
  _userName,
  _jobTitle,
  _profilePhoto,
  _description,
  _likes,
  _dislikes,
  _authorId,
  onDeletePost,
}) {
  const [postId, setPostId] = useState(_postId); // may be used for expanded view later...
  const [userName, setUserName] = useState(_userName);
  const [jobTitle, setJobTitle] = useState(_jobTitle);
  const [profilePhoto, setProfilePhoto] = useState(_profilePhoto);
  const [description, setDescription] = useState(_description);
  const [likes, setLikes] = useState(_likes);
  const [dislikes, setDislikes] = useState(_dislikes);
  const [authorId, setAuthorId] = useState(_authorId);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClick = (e) => {
    console.log("Edit");
    e.stopPropagation();
  };

  const handleDeleteClick = async (e) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 204) {
        // Tia TODO: create a popup saying that the post got deleted successfully
        onDeletePost(postId);
      } else {
        console.log(
          "Tia TODO: display an error saying failed to delete a post (res.data.error)"
        );
      }
    } catch (err) {
      console.log("err:", err.message);
      console.log("Tia TODO: display an error saying failed to delete a post");
    }

    e.stopPropagation();
  };

  function onCardClick() {
    console.log("post was clicked", postId);
  }

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
      } else {
        console.log("err.message:", res.data.error);
      }
    }
  }

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
                  onClick={(event) => handleEditClick(event)}
                  style={{ position: "absolute", top: "10px", right: "50px" }}
                >
                  <EditIcon />
                </IconButton>
              </>
            ) : null}
          </div>
          <CardActionArea onClick={() => handleOpen()}>
            <CardContent style={{ position: "relative" }}>
              <Stack direction={"row"} spacing={2} paddingBottom={"1vh"}>
                <Avatar
                  src={profilePhoto}
                  sx={{ width: 60, height: 60 }}
                ></Avatar>
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
                {description}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" onClick={handleLike} sx={{color: 'accent.main'}}>
              {likes.includes(localStorage.getItem("email")) ? (
                <ThumbUpAltIcon />
              ) : (
                <ThumbUpOffAltIcon />
              )}
              {likes.length}
            </Button>
            <Button size="small" onClick={handleDislike} sx={{color: 'accent.main'}}>
              {dislikes.includes(localStorage.getItem("email")) ? (
                <ThumbDownAltIcon />
              ) : (
                <ThumbDownOffAltIcon />
              )}
              {dislikes.length}
            </Button>
            <Button sx={{color: 'accent.main'}}>
              <CommentIcon />
            </Button>
            <Button sx={{color: 'accent.main'}}>
              <IosShareIcon />
            </Button>
            {/* <Button>
                        <BookmarkBorderIcon />
                    </Button> */}
          </CardActions>
        </Card>
        <Box>
          <ExpandedPost
            _postId={postId}
            _content={description}
            _userName={userName}
            _jobTitle={jobTitle}
            _profilePhoto={profilePhoto}
            _likes={likes}
            _dislikes={dislikes}
            open={open}
            handleClose={handleClose}
            handleDislike={handleDislike}
            handleLike={handleLike}
          />
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default Post;

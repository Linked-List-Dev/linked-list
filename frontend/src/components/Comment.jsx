import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import {
  Avatar, Typography,
  Stack,
  CardContent,
  IconButton,
  Box,
  Snackbar,
  Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import EditComment from "./Modals/EditComment";
import Linkify from "../util/Linkify";
import { Link } from "react-router-dom";

function Comment({
  _key,
  _content,
  _authorName,
  _authorId,
  _createdAt,
  _updatedAt,
  _profilePhoto,
  onCommentDelete,
  onCommentUpdate
}) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [authorId, setAuthorId] = useState(_authorId);
  const [userName, setUserName] = useState(_authorName);
  const [content, setContent] = useState(_content);
  const [createdAt, setCreatedAt] = useState(_createdAt);
  const [updatedAt, setUpdatedAt] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [commentId, setCommentId] = useState(_key);
  const [profilePhoto, setProfilePhoto] = useState(_profilePhoto);
  const [commentDeleteFailedVis, setCommentDeleteFailedVis] = useState(false);
  const [commentDeleteSucceededVis, setCommentDeleteSucceededVis] = useState(false);

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleCommentUpdate = (newContent) => {
    onCommentUpdate(commentId, newContent);
    setContent(newContent);
  };

  const closeCommentDeleteSucceededVis = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setCommentDeleteSucceededVis(false);
  };


  const closeCommentDeleteFailedVis = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setCommentDeleteFailedVis(false);
  };

  const handleDeleteClick = async (e) => {
    try {
      const res = await axios.delete(
        `${API_URL}/posts/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(res.status);
      if (res.status === 204) {
        setCommentDeleteSucceededVis(true)
        onCommentDelete(commentId);
      }
    } catch (err) {
      e.preventDefault();
      console.log("err.response:", err.response)
      setCommentDeleteFailedVis(true)
    }
    e.stopPropagation();
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
    <Box sx={{ textAlign: "left", color: "text.primary" }}>

      <Card >
        <div style={{ position: "relative", zIndex: 999 }}>
          {_authorId.toString() === localStorage.getItem("id") ? ( //only author can edit/delete their posts
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
        <CardContent sx={{ display: 'block' }}>
          <Stack direction={"row"} spacing={2} paddingBottom={"1vh"}>
            <IconButton
              component={Link}
              to={`/profile/${authorId}`}
            >
              <Avatar
                alt="Profile Picture"
                src={profilePhoto}
                sx={{ width: 40, height: 40 }}
              >
                {profilePhoto ? null : userName[0]}
              </Avatar>
            </IconButton>
            <Typography variant="h5">{userName}</Typography>
          </Stack>
          <Typography>
            <Linkify text={content} />
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: "text.secondary", textAlign: 'right' }}>{updatedAt}</Typography>
          </Box>

          <Snackbar
            open={commentDeleteFailedVis}
            autoHideDuration={3000}
            onClose={closeCommentDeleteFailedVis}
          >
            <Alert
              onClose={closeCommentDeleteFailedVis}
              severity="success"
              sx={{ width: "100%" }}
            >
              Something went wrong trying to delete a comment! Try again later...
            </Alert>
          </Snackbar>

          <Snackbar
            open={commentDeleteSucceededVis}
            autoHideDuration={3000}
            onClose={closeCommentDeleteSucceededVis}
          >
            <Alert
              onClose={closeCommentDeleteSucceededVis}
              severity="success"
              sx={{ width: "100%" }}
            >
              Comment deleted successfully!
            </Alert>
          </Snackbar>

        </CardContent>
      </Card>

      <EditComment
        _content={content}
        _commentId={_key}
        _open={editOpen}
        _handleClose={handleEditClose}
        onUpdateComment={handleCommentUpdate}
      />
    </Box>
  );
}
export default Comment;

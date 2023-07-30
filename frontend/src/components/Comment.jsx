import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import {
  Avatar, Typography,
  Stack,
  CardContent,
  IconButton,
  Box
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import EditComment from "./Modals/EditComment";

function Comment({
  _key,
  _content,
  _authorName,
  _authorId,
  _createdAt,
  _updatedAt,
  onCommentDelete,
}) {
  const [userName, setUserName] = useState(_authorName);
  const [content, setContent] = useState(_content);
  const [createdAt, setCreatedAt] = useState(_createdAt);
  const [updatedAt, setUpdatedAt] = useState(_updatedAt);
  const [editOpen, setEditOpen] = useState(false);
  const [commentId, setCommentId] = useState(_key);

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleCommentUpdate = (newContent) => {
    setContent(newContent);
  };

  const handleDeleteClick = async (e) => {
    const res = await axios.delete(
      `http://localhost:8000/api/posts/comment/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(res.status);
    if (res.status === 204) {
      // Tia TODO: create a popup saying that the post got deleted successfully
      onCommentDelete(commentId);
    } else {
      console.log(
        "Tia TODO: display an error saying failed to delete a post (res.data.error)"
      );
    }

    e.stopPropagation();
  };

  return (
    <Box sx={{ textAlign: "left", color: "text.primary" }}>
      <Card sx={{ padding: "2vh" }}>
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
        <CardContent>
          <Stack direction={"row"} spacing={2} paddingBottom={"1vh"}>
            <Avatar sx={{ width: 40, height: 40 }}>{userName[0]}</Avatar>
            <Typography variant="h5">{userName}</Typography>
          </Stack>
          <Typography>{content}</Typography>
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

import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import {
  Button,
  CardActionArea,
  CardActions,
  ThemeProvider,
  Avatar,
  Paper,
  Typography,
  Stack,
  CardContent,
  IconButton,
  Box
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
import EditComment from "./EditComment";

function Comment({_key, _content, _authorName, _authorId, _createdAt, _updatedAt}){
    const [userName, setUserName] = useState(_authorName)
    const [content, setContent] = useState(_content)
    const [createdAt, setCreatedAt] = useState(_createdAt)
    const [updatedAt, setUpdatedAt] = useState(_updatedAt)
    const [editOpen, setEditOpen] = useState(false)
    
    const handleEditOpen = () => {
      setEditOpen(true);
    };
  
    const handleEditClose = () => {
      setEditOpen(false);
    };

    const onUpdateComment = () => {

    }

    const handleDeleteClick = async (e) => {
      //adjust to do for comments
      // const res = await axios.delete(
      //   `http://localhost:8000/api/posts/${postId}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("token")}`,
      //     },
      //   }
      // );
  
      // console.log(res.status);
      // if (res.status === 204) {
      //   // Tia TODO: create a popup saying that the post got deleted successfully
      //   onDeletePost(postId);
      // } else {
      //   console.log(
      //     "Tia TODO: display an error saying failed to delete a post (res.data.error)"
      //   );
      // }
      
      e.stopPropagation();
    };
    
    return(
        <Box sx={{textAlign: 'left', color: 'text.primary'}}>
            <Card  sx={{padding: '2vh',}}>
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
                  <Avatar sx={{ width: 40, height: 40 }}>
                    {userName[0]}
                  </Avatar>
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
          onUpdateComment={onUpdateComment}/>
        </Box>
    )
}
export default Comment
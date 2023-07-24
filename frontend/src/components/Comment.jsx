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

function Comment({_content, _authorName, _authorId, _createdAt, _updatedAt}){
    const [userName, setUserName] = useState(_authorName)
    const [content, setContent] = useState(_content)
    const [createdAt, setCreatedAt] = useState(_createdAt)
    const [updatedAt, setUpdatedAt] = useState(_updatedAt)
  
    return(
        <Box sx={{textAlign: 'left', color: 'text.primary'}}>
            <Card  sx={{padding: '2vh',}}>
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
            
        </Box>
    )
}
export default Comment
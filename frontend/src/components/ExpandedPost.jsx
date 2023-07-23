import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import {
  Button,
TextField,  CardActions,
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

const fakeComments = [
  {
    content: "Wow I also need a job I love you so much",
    authorName: "Maserati Bugatti",
    authorId: "64ba08b6a235170b4bc19697", // we need to get job title etc using this -> Artems userId
  },
  {
    content: "This is a great post",
    authorName: "Drake",
    authorId: "64ba0a1477b5fd3499ab805e", // -> Tia userId
  },
];

function ExpandedPost({
  _postId,
  _content,
  _userName,
  _jobTitle,
  _profilePhoto,
  _likes,
  _dislikes,
  open,
  handleClose,
  handleLike,
  handleDislike
}) {
  const [content, setContent] = useState(_content);
  const [userName, setUserName] = useState(_userName);
  const [jobTitle, setJobTitle] = useState(_jobTitle);
  const [profilePhoto, setProfilePhoto] = useState(_profilePhoto);
  const [postId, setpostId] = useState("abc");
  const [comments, setComments] = useState(fakeComments);
  const [likes, setLikes] = useState(_likes)
  const [dislikes, setDislikes] = useState(_dislikes)
  const [commentContent, setCommentContent] = useState("")

  console.log(_postId, open);

    //TODO ARTEM like/dislike not changing number or icon.
    // using axios from Post.jsx gives a 500 error
    // so that is why its not included here

    const handleComment = (e) => {
        console.log(commentContent)
        setCommentContent("")
    }

    const handleChange = (e) => {
        setCommentContent(e.target.value)
    }

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
            <Card sx={{
              backgroundColor: "page.main",
              borderRadius: 2,
              width: "40vw",
            }}>
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
                    {content}
                  </Typography>
              </CardContent>
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
              <IosShareIcon />
            </Button>
            {/* <Button>
                        <BookmarkBorderIcon />
                    </Button> */}
          </CardActions>
                    </Box>
                
            

              <Box sx={{textAlign: 'center', alignItems: 'center', backgroundColor: 'page.secondary', paddingBottom: '1vh', color: 'text.primary'}}>
                <Divider sx={{fontFamily: 'Lato'}}/>
                <Typography variant="h5" sx={{color: 'text.secondary', textAlign: 'left', paddingLeft: '1vw', paddingTop: '1vh'}}>Comments</Typography>
                <Stack  paddingTop={'1vh'}>
                {fakeComments.map((comment,index) => (
                    <Comment key={index} _content={comment.content} _authorId={comment.authorId} _authorName={comment.authorName}/>
                ))}
                </Stack>
                <Divider sx={{fontFamily: 'Lato'}}/>
                <Stack direction={'row'}>
                <TextField variant="filled" label="Add comment" fullWidth onChange={handleChange} value={commentContent}/>
                <Button variant="contained" disableElevation sx={{backgroundColor: 'accent.main', "&:hover": {
                      backgroundColor: "accent.secondary",
                    }}} onClick={handleComment} >Comment</Button>
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

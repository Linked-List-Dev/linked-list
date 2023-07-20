import * as React from 'react';
import { useState } from "react"
import Card from '@mui/material/Card';
import { Button, 
    CardActionArea, 
    CardActions, 
    ThemeProvider,
    Avatar, 
    Typography,
    Stack,
    CardContent } from '@mui/material';
import AppTheme from '../util/Theme'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import CommentIcon from '@mui/icons-material/Comment';
import IosShareIcon from '@mui/icons-material/IosShare';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

function Post({_postId, _userName, _jobTitle, _profilePhoto, _description, _numLikes, _numDislikes}) {
    const [postId, setPostId] = useState(_postId) // may be used for expanded view later...
    const [userName, setUserName] = useState(_userName)
    const [jobTitle, setJobTitle] = useState(_jobTitle)
    const [profilePhoto, setProfilePhoto] = useState(_profilePhoto)
    const [description, setDescription] = useState(_description)
    const [numLikes, setNumLikes] = useState(_numLikes)
    const [numDislikes, setNumDislikes] = useState(_numDislikes)
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)

    const handleLike = (e) => {
        setLiked((prevLiked) => !prevLiked)
        setDisliked(false)
    }

    const handleDislike = (e) => {
        setDisliked(true)
        setLiked(false)
    }

  return (
    <div>
        <ThemeProvider theme={AppTheme}>
            <Card sx={{bgcolor: 'page.main'}}>
                <CardActionArea>
                    <CardContent>
                        <Stack direction={'row'} spacing={2} paddingBottom={'1vh'}>
                            <Avatar src={profilePhoto} sx={{ width: 60, height: 60 }}></Avatar>
                            <Stack>
                                <Typography variant="h5">
                                    {userName}
                                </Typography>
                                <Typography variant="body1" component="div" style={{ verticalAlign: 'sub' }}>
                                    {jobTitle}
                                </Typography>
                            </Stack>
                        </Stack>

                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>

                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary" onClick={handleLike}>
                        {liked ? <ThumbUpAltIcon/> : <ThumbUpOffAltIcon/>}
                    {numLikes}
                    </Button>
                    <Button size="small" color="primary" onClick={handleDislike}>
                        {disliked ? <ThumbDownAltIcon/> : <ThumbDownOffAltIcon />}
                    
                    
                    {numDislikes}
                    </Button>
                    <Button>
                        <CommentIcon/>
                    </Button>
                    <Button>
                        <IosShareIcon/>
                    </Button>
                    <Button>
                        <BookmarkBorderIcon/>
                    </Button>
                </CardActions>
            </Card>
        </ThemeProvider>
    </div>
    
    
  );
}

export default Post
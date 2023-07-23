import * as React from "react";
import { useState } from "react";
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

function EditPost({_content, _open, _handleClose}){
    const [content, setContent] = useState(_content)
    const [open, setOpen] = useState(_open)

    const handleSubmit = (e) => {
        console.log(content)

        // TODO update the post

        _handleClose()

    }

    const handleChange = (e) => {
        setContent(e.target.value)
    }

    return(
        <div>
            <ThemeProvider theme={AppTheme}>
            <Modal
          open={_open}
          onClose={_handleClose}
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
            }}
          >
            <Stack>
              <Box>
                <CardContent>
                <Stack alignItems={"center"} spacing={3}>
                    <Typography variant="h3" color="accent.main">
                      Edit Your Post
                    </Typography>
                    <TextField
                      sx={{ width: "30vw" }}
                      multiline
                      rows={5}
                      variant="outlined"
                      name="content"
                      label="What's on your mind?"
                      value={content}
                      onChange={handleChange}
                      fullWidth
                      required
                    />

                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: "accent.main",
                        textTransform: "none",
                        borderRadius: 4,
                        width: "7vw",
                        height: "auto",
                        "&:hover": {
                          backgroundColor: "accent.secondary",
                        },
                      }}
                    >
                      <Typography variant="h4">Save</Typography>
                    </Button>
                  </Stack>
                </CardContent>
                </Box>
                </Stack>
              
          </Card>
        </Modal>
            </ThemeProvider>
        </div>
    )
}

export default EditPost
import React, { useState, useEffect } from "react";
import { Box, Modal, Stack, Typography } from "@mui/material"
import FollowerCard from "../FollowerCard";

const follows = [
    {
        id: 1,
        name: "Drake",
    },
    {
        id: 2,
        name: "Sana"
    }
]

function ShowFollowingModal({open, handleClose}) {
    return(
        <Box>
            <Modal
            open={open}
            onClose={handleClose}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
                <Box sx={{
          backgroundColor: "page.main",
          borderRadius: 2,
          width: "40vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          "@media (max-width: 768px)": {
            width: "70vw",
          },
        }}>
            <Stack spacing={1} sx={{width: "40vw", paddingBottom: '2vh',
          "@media (max-width: 768px)": {
            width: "70vw",
          }}}>
                <Box sx={{paddingBottom: '1vh', paddingTop: '1vh'}}>
                <Typography variant="h5">
                    Following List
            </Typography>
                </Box>
            

            <Box>
                <Stack sx={{ maxHeight: "50vh", overflow: "auto" }}>
                    {follows.map((follow) => (
                        <FollowerCard key={follow.id} name={follow.name}/>
                    ))}
                </Stack>
            </Box>
            </Stack>
            
                </Box>
            </Modal>
        </Box>
    )
}

export default ShowFollowingModal
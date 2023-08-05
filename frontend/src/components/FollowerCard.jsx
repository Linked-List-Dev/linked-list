import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Card, CardContent, Modal, Stack, Typography } from "@mui/material"

function FollowerCard({name}) {
    return(
        <Box>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Stack direction={'row'} spacing={1}>

<Avatar sx={{ width: 40, height: 40 }}>{name[0]}</Avatar>
            <Typography variant="h6">{name}</Typography>
            </Stack>

            <Box>
              <Button variant="contained" onClick={() => console.log('follow')}>
                Follow
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => console.log('unfollow')}
              >
                Unfollow
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
    )
}

export default FollowerCard
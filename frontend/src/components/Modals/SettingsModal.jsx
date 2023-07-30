import React from "react";
import { Button, Typography, Modal, Box, Stack } from "@mui/material";

function SettingsModal({
  settingsOpen,
  closeSettingsModal,
  handleLogOut,
  openConfirmationModal,
}) {
  return (
    <Modal
      open={settingsOpen}
      onClose={closeSettingsModal}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "page.main",
          borderRadius: 5,
          width: "40vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          "@media (max-width: 768px)": {
            width: "70vw",
          },
        }}
      >
        <Box paddingTop="3vh" paddingBottom="3vh">
          <Stack
            spacing={5}
            alignItems="center"
            justifyContent="center"
            paddingTop="2vh"
            paddingBottom="2vh"
          >
            <Typography variant="h3" color="accent.main">
              Settings
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                width: "20vw",
                backgroundColor: "accent.main",
                "&:hover": {
                  backgroundColor: "accent.secondary",
                },
                "@media (max-width: 768px)": {
                  width: "50vw",
                },
              }}
              onClick={handleLogOut}
            >
              Log Out
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="large"
              sx={{
                width: "20vw",
                whiteSpace: "nowrap",
                "@media (max-width: 768px)": {
                  width: "50vw",
                },
              }}
              onClick={openConfirmationModal}
            >
              Delete Account
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

export default SettingsModal;

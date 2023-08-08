import React, { useState } from "react";
import { Button, Typography, Modal, Box, Stack } from "@mui/material";
import ConfirmationMessageModal from "./ConfirmationMessageModal";

function SettingsModal({
  settingsOpen,
  closeSettingsModal,
  handleLogOut,
}) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const openSettingsModal = () => setSettingsOpen(true);
  const closeConfirmationModal = () => setConfirmOpen(false);

  const openConfirmationModal = () => {
    console.log('hi')
    closeSettingsModal()
    setConfirmOpen(true);
  };

  const handleDeleteAccount = async () => {
    const res = await axios.delete(
      `${API_URL}/users/${localStorage.getItem("id")}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(res.status);
    if (res.status === 204) {
      // Tia TODO: create a popup saying that the user got deleted successfully
    } else {
      console.log(
        "Tia TODO: display an error saying failed to delete a post (res.data.error)"
      );
    }

    localStorage.setItem("token", "");
    localStorage.setItem("id", "");
    localStorage.setItem("email", "");
    localStorage.setItem("username", "");
    navigate("/");
  };

  return (
    <Box>
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
    <ConfirmationMessageModal confirmOpen={confirmOpen} handleDeleteAccount={handleDeleteAccount} closeConfirmationModal={closeConfirmationModal}/>
    </Box>
    
  );
}

export default SettingsModal;

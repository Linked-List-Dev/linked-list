import React, { useState } from "react";
import { Button, Typography, Modal, Box, Stack, Snackbar, Alert } from "@mui/material";
import ConfirmationMessageModal from "./ConfirmationMessageModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SettingsModal({
  settingsOpen,
  closeSettingsModal,
  handleLogOut,
}) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteAccountFailedVis, setDeleteAccountFailedVis] = useState(false);
  const [deleteAccountSucceededVis, setDeleteAccountSucceededVis] = useState(false);

  const navigate = useNavigate();

  const closeConfirmationModal = () => setConfirmOpen(false);

  const openConfirmationModal = () => {
    closeSettingsModal()
    setConfirmOpen(true);
  };

  const handleDeleteAccount = async () => {
    try {
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
        localStorage.setItem("token", "");
        localStorage.setItem("id", "");
        localStorage.setItem("email", "");
        localStorage.setItem("username", "");

        setDeleteAccountSucceededVis(true);

        setTimeout(() => {
          navigate("/");
        }, 1600);

      }
    } catch (err) {
      console.log("err.response:", err.response)
      setDeleteAccountFailedVis(true)
    }
  };

  const deleteAccountFailedVisClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setDeleteAccountFailedVis(false);
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
      <ConfirmationMessageModal confirmOpen={confirmOpen} handleDeleteAccount={handleDeleteAccount} closeConfirmationModal={closeConfirmationModal} />

      <Snackbar
        open={deleteAccountSucceededVis}
        autoHideDuration={1600}
      >
        <Alert
          severity="success"
          sx={{ width: "100%" }}
        >
          You have successfully deleted your account and logged out!
        </Alert>
      </Snackbar>

      <Snackbar
        open={deleteAccountFailedVis}
        autoHideDuration={8000}
        onClose={deleteAccountFailedVisClose}
      >
        <Alert
          onClose={deleteAccountFailedVisClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Something went wrong when deleting your account. Try again later...
        </Alert>
      </Snackbar>

    </Box>
  );
}

export default SettingsModal;

import React from "react";
import { Button, Typography, Modal, Box, Stack } from "@mui/material";

function ConfirmationMessageModal({
  confirmOpen,
  closeConfirmationModal,
  handleDeleteAccount,
}) {
  return (
    <Modal
      open={confirmOpen}
      onClose={closeConfirmationModal}
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
        <Stack
          paddingTop={"2vh"}
          paddingBottom={"2vh"}
          alignItems="center"
          justifyContent="center"
          spacing={5}
        >
          <Stack>
            <Typography variant="h3">Delete Account</Typography>
            <Typography>
              Are you sure you want to do this? This action is not reversable.
            </Typography>
          </Stack>
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
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default ConfirmationMessageModal;

import express from 'express';
const app = express();
const PORT = 8000;

// Define routes or middleware here

// Start the server
app.listen(PORT, () => {
  console.log(`[Backend ⚡️]: Server is running on port ${PORT}`);
});
const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3001;


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));



server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

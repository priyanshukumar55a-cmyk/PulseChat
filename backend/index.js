const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRouter = require('./Routes/userRoutes');
const cors = require("cors");

const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
require('colors');
dotenv.config();

connectDB();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", authRouter);

app.use(notFound);
app.use(errorHandler)


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));



server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green.bold);
});

const mongoose = require('mongoose');
require('dotenv').config();
require('colors');

const connectDB = async () => {
  try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully'.yellow.bold);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
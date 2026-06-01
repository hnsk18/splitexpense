const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/expensedb')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const userRoutes = require("./routes/user.route");

app.use("/", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const app = express();
const PORT = 3000;

const allowedOrigins = [
    /^https:\/\/[a-z0-9-]+-5173\.inc1\.devtunnels\.ms$/,
    /^https:\/\/[a-z0-9-]+-3000\.inc1\.devtunnels\.ms$/,
    "http://localhost:5173",
    "http://localhost:3000"
];

const corsOptions = {
    origin(origin, callback) {
        if (!origin) {
            return callback(null, true);
        }

        const isAllowed = allowedOrigins.some((allowedOrigin) => {
            if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }

            return allowedOrigin === origin;
        });

        return isAllowed
            ? callback(null, true)
            : callback(new Error("Not allowed by CORS"));
    },
    credentials: true
};

app.use(cors({
    origin: [
        "https://b76kbjr1-5173.inc1.devtunnels.ms",
        "https://j4d5bzxn-5173.inc1.devtunnels.ms",
        "http://localhost:3000"
    ],
    credentials: true
}));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/expensedb')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const userRoutes = require("./routes/user.route");
const groupRoutes = require("./routes/group.route");
const publicRoutes = require("./routes/public.route");
const auth = require("./middlewares/auth");

app.use("/public", publicRoutes);
app.use("/user", auth, userRoutes);
app.use("/group", auth, groupRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
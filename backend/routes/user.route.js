const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");

const {
    register,
    login,
    profile,
    updateProfile,
    getNameByUpi,
    getByPhone,
    getGroups,
    changePassword
} = require("../controllers/user.controller");


// PUBLIC ROUTES
router.post("/public/register", register);

router.post("/public/login", login);

router.get("/public/:upi/name", getNameByUpi);

router.get("/public/:phone", getByPhone);


// PRIVATE ROUTES
router.get(
    "/user/profile",
    auth,
    profile
);

router.put(
    "/user/profile",
    auth,
    updateProfile
);

router.get(
    "/user/group/getall",
    auth,
    getGroups
);

router.post(
    "/user/change-password",
    auth,
    changePassword
);

module.exports = router;
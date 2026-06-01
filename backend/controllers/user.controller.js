const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Group = require("../models/group.model");

// REGISTER
exports.register = async (req, res) => {

    try {

        const { phone, upi, name, password } = req.body;

        const existing = await User.findOne({
            $or: [{ phone }, { upi }]
        });

        if (existing) {
            return res.status(400).json({
                message: "User already exists",
                status: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            phone,
            upi,
            name,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            status: true
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
            status: false
        });
    }
};


// LOGIN
exports.login = async (req, res) => {

    try {

        const { phone, password } = req.body;

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                status: false
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Wrong password",
                status: false
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                upi: user.upi
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            status: true
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
            status: false
        });
    }
};


// GET PROFILE
exports.profile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        res.json({
            user,
            status: true
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
            status: false
        });
    }
};

exports.updateProfile = async (req, res) => {

    try {

        const { name } = req.body;

        await User.findByIdAndUpdate(
            req.user.id,
            { name }
        );

        res.json({
            message: "Profile updated successfully",
            status: true
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
            status: false
        });
    }
};

exports.getNameByUpi = async (req, res) => {

    try {

        const user = await User.findOne({
            upi: req.params.upi
        });

        if (!user) {

            return res.status(404).json({
                message: "User not found",
                status: false
            });
        }

        res.json({
            name: user.name,
            status: true
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
            status: false
        });
    }
};

exports.getByPhone = async (req, res) => {

    try {

        const user = await User.findOne({
            phone: req.params.phone
        });

        if (!user) {

            return res.status(404).json({
                message: "User not found",
                status: false
            });
        }

        res.json({
            name: user.name,
            upi: user.upi,
            status: true
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
            status: false
        });
    }
};

exports.getGroups = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .populate("groups");

        res.json({
            groups: user.groups,
            status: true
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
            status: false
        });
    }
};


exports.changePassword = async (req, res) => {

    try {

        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        const match = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!match) {

            return res.status(400).json({
                message: "Old password incorrect",
                status: false
            });
        }

        const hashed = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashed;

        await user.save();

        res.json({
            message: "Password changed successfully",
            status: true
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
            status: false
        });
    }
};
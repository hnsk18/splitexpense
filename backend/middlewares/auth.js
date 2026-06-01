const jwt = require("jsonwebtoken");
const JWT_SECRET="splitexpensejwt";
const auth = (req, res, next) => {

    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({
            message: "No token",
            status: false
        });
    }

    try {

        const token = header.split(" ")[1];

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token",
            status: false
        });
    }
};

module.exports = auth;
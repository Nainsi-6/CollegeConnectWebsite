const jwt = require("jsonwebtoken");

const generateToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SEC, {
        expiresIn: "15d",
    });

    res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true,  // ✅ Prevents client-side access to cookies
        sameSite: "strict",  // ✅ Protects against CSRF attacks
    });
};

module.exports = generateToken;

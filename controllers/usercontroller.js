const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { UserModel } = require("../models")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

router.post("/register", async (req,res) => {

    let { email, username, password, role } = req.body;
    try{
    const User = await UserModel.create({
        email,
        username,
        password: bcrypt.hashSync(password, 14),
        role
    })

    let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 12})

    res.status(200).json({
        message: "User successfully register",
        user: User,
        sessionToken: token,
        // role
    })
} catch (err) {
    if (err instanceof UniqueConstraintError) {
        res.status(409).json({
            message: "Email or username already in use",
        })
    } else {
    res.status(500).json({
        message: "Failed to register user",
    });
}
}
})


router.post("/login", async (req, res) => {
    let { email, password } = req.body;

    try {
    const loginUser = await UserModel.findOne({
        where: {
            email: email,
        },
    })

    if (loginUser) {

        let passwordComparison = await bcrypt.compare(password, loginUser.password)
        
        if (passwordComparison) {

        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 12})

        res.status(200).json({
        user: loginUser,
        message: "User succesfully logged in!",
        sessionToken: token
    })
} else {
    res.status(401).json({
        message: "Incorrect email or password"
    })
}
} else {
    res.status(401).json({
        message: "Incorrect email or password"
    })
}
} catch (error) {
    res.status(500).json({
        message: "Failed to log user in"
    })
}
})

module.exports = router;
const User = require("../model/userModel");
const brcypt = require("bcrypt");

module.exports.register = async (req, res, next) => {

    try {
        const { username, email, password } = req.body
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.json({ msg: "Username already used", status: false })
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: "Email already used", status: false })
        }
        const hashedPassword = await brcypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword
        });
        delete user.password;
        return res.json({
            status: true,
            user
        })
    } catch (error) {
        next(error);
        console.log(error);
    }

}
module.exports.login = async (req, res, next) => {

    try {
        const { username, password } = req.body
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ msg: "Incorrect username or password1", status: false })
        }
        const isPasswordValid = await brcypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ msg: "Incorrect username or password2", status: false })
        }
        delete user.password;
        return res.json({ status: true, user })
    } catch (error) {
        next(error);
        console.log(error);
    }

}
module.exports.setAvatar = async (req, res, next) => {

    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        })

        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage
        })
    } catch (error) {
        next(error);
        console.log(error);
    }

}
module.exports.getAllUsers = async (req, res, next) => {

    try {
        // console.log("alo");
        console.log(req.params.id);
        // Select allusers expect currentUser
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);

        // .find({ _id: req.params.id }, {
        //     email: 1,
        //     username: 1,
        //     avatarImage: 1,
        //     _id: 1
        // })


        // console.log("check users: ", users);
        return res.json(users);
    } catch (error) {
        next(error);
        console.log(error);
    }

}
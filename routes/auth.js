const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//REGISTER
router.post('/register', async (req, res) => {

    if (!req.body.email || !req.body.username || !req.body.password) res.status(400).json('Email, Username and Password are required');

    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        const createdUser = await user.save();
        res.status(200).json(createdUser);

    } catch (err) {
        res.status(500).json(err);
    }

});


//LOGIN
router.post('/login', async (req, res) => {

    if (!req.body.email || !req.body.password) res.status(400).json('Email and Password are required');

    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json('User not found')

        const password = await bcrypt.compare(req.body.password, user.password);
        !password && res.status(400).json('Incorrect password');

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }

});


module.exports = router;
const router = require('express').Router();
const User = require('../models/User');


//Create
router.get('/register', async (req, res) => {
    const user = await new User({
        username: 'John',
        email: 'John@gmail.com',
        password: 'john123',
    })


    await user.save();

    res.send(JSON.stringify(user));
})

module.exports = router;
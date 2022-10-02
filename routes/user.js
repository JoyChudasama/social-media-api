const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');


//UPDATE
router.put('/update/:id', async (req, res) => {

    console.log(req.body.isAdmin, !req.body.isAdmin)

    if (req.body.userId !== req.params.id && !req.body.isAdmin) return res.status(403).json('Only owners can update their account');

    //Setting password to new Hashed password if password is given
    if (req.body.password) {
        try {
            const salt = await bcrypt.genSalt();
            req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    //Updating User
    try {
        await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        });

        res.status(200).json('Account has been updated succesfully');

    } catch (err) {
        res.status(500).json(err);
    }
});


//DELETE
router.delete('/delete/:id', async (req, res) => {

    if (req.body.userId !== req.params.id || !req.body.isAdmin) return res.status(403).json('Only owners can delete their account');

    try {
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json('Account has been deleted succesfully');

    } catch (err) {
        res.status(500).json(err);
    }
});


//GET ONE
router.get('/get/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id);

        !user && res.status(404).json('User not found');

        const { password, createdAt, updatedAt, isAdmin, ...other } = user._doc;

        res.status(200).json(other);

    } catch (err) {
        res.status(500).json(err);
    }
});


//FOLLOW A USER
router.put('/follow/:id', async (req, res) => {

    if (req.body.userId === req.params.id) return res.status(403).json('Invalid userId');

    try {
        const currentUser = await User.findById(req.body.userId.trim());
        const userToBeFollowed = await User.findById(req.params.id);

        !userToBeFollowed && res.status(404).json('User not found');

        if (currentUser.followings.includes(userToBeFollowed.id)) return res.status(403).json(`Already following`);

        await currentUser.updateOne({ $push: { followings: userToBeFollowed.id } });
        await userToBeFollowed.updateOne({ $push: { followers: currentUser.id } });

        res.status(200).json('Followed succesfully');

    } catch (err) {
        res.status(500).json(err);
    }
});


//UNFOLLOW A USER
router.put('/unfollow/:id', async (req, res) => {

    if (req.body.userId === req.params.id) return res.status(403).json('Invalid userId');

    try {
        const userToBeUnfollowed = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId.trim());

        !userToBeUnfollowed && res.status(404).json('User not found');

        if (!currentUser.followings.includes(userToBeUnfollowed.id)) return res.status(403).json(`Only followed users can be unfollowed`);

        await currentUser.updateOne({ $pull: { followings: userToBeUnfollowed.id } });
        await userToBeUnfollowed.updateOne({ $pull: { followers: currentUser.id } });

        res.status(200).json('Unfollowed succesfully');

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
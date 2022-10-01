const router = require('express').Router();
const Post = require('../models/Post');

//CREATE A POST
router.post('/create', async (req, res) => {

    if (!req.body.userId || ((!req.body.description || req.body.description.trim().length === 0) && (!req.body.img || req.body.img.trim().length === 0))) {
        return res.status(403).json('userId and description or img is required');
    }

    try {
        const post = new Post({
            userId: req.body.userId.trim(),
            description: req.body.description,
            img: req.body.img,
        });

        const createdPost = await post.save();
        res.status(200).json(createdPost);
    } catch (err) {
        res.status(500).json(err);
    }
})


//UPDATE A POST
router.put('/update/:id', async (req, res) => {

    if (!req.params.id || !req.body.userId) return res.status(403).json('postId and userId is required');

    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(403).json('Post not found');

        if ((!req.body.description || req.body.description.trim().length === 0) && (!req.body.img || req.body.img.trim().length === 0)) {
            return res.status(403).json('Description or img is required');
        }

        if (post.userId !== req.body.userId.trim()) return res.status(403).json('Only owners can update their posts');

        await Post.findByIdAndUpdate(req.params.id, {
            $set: req.body
        });

        res.status(200).json('Post has been updated succesfully');

    } catch (err) {
        res.status(500).json(err);
    }
})


//DELETE A POST
router.delete('/delete/:id', async (req, res) => {

    if (!req.params.id || !req.body.userId) return res.status(403).json('postId and userId is required');

    try {
        const post = await Post.findById(req.params.id.trim());

        if (!post) return res.status(403).json('Post not found');

        if (post.userId !== req.body.userId.trim()) return res.status(403).json('Only owners can delete their posts');

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json('Post has been deleted succesfully');

    } catch (err) {
        res.status(500).json(err);
    }
})


//GET A POST
router.get('/get/:id', async (req, res) => {

    if (!req.params.id) return res.status(403).json('postId is required');

    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json('User not found');

        res.status(200).json(post);

    } catch (err) {
        res.status(500).json(err);
    }
})


//GET ALL USER'S POSTS
router.get('/getAllForUser/:id', async (req, res) => {

    if (!req.params.id) return res.status(403).json('userId is required');

    try {
        const posts = await Post.find({ userId: req.params.id });

        res.status(200).json(posts);

    } catch (err) {
        res.status(500).json(err);
    }
})


//LIKE A POST
router.put('/like/:id', async (req, res) => {

    if (!req.params.id || !req.body.userId) return res.status(403).json('postId and userId is required');

    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(403).json('Post not found');

        //Dislikes post if already liked
        if (post.likes.includes(req.body.userId)) {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            return res.status(403).json('Post has been disliked succesfully');
        }

        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json('Post has been liked succesfully');

    } catch (err) {
        res.status(500).json(err);
    }
})


//GET USER'S TIMELINE POSTS
router.get('/getTimelinePostsForUser/:id', async (req, res) => {

    if (!req.params.id) return res.status(403).json('userId is required');
   
    try {
        res.status(200).json('USERS TIMELINE POSTS');
    } catch (err) {
        res.status(500).json(err);
    }
})



module.exports = router;
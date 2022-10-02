const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

//CREATE A POST
router.post('/create', async (req, res) => {

    const userId = req.body.userId.trim();
    const description = req.body.description.trim();
    const img = req.body.img.trim();

    if (!userId || ((!description || description.length === 0) && (!img || img.length === 0))) {
        return res.status(403).json('userId and description or img is required');
    }

    try {
        const post = new Post({
            userId: userId,
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

    const postId = req.params.id.trim();
    const userId = req.body.userId.trim();
    const description = req.body.description.trim();
    const img = req.body.img.trim();

    if (!postId || !userId) return res.status(403).json('postId and userId is required');

    try {
        const post = await Post.findById(postId);

        if (!post) return res.status(403).json('Post not found');

        if ((!description || description.length === 0) && (!img || img.length === 0)) {
            return res.status(403).json('Description or img is required');
        }

        if (post.userId !== userId) return res.status(403).json('Only owners can update their posts');

        await Post.findByIdAndUpdate(postId, {
            $set: req.body
        });

        res.status(200).json('Post has been updated succesfully');

    } catch (err) {
        res.status(500).json(err);
    }
})


//DELETE A POST
router.delete('/delete/:id', async (req, res) => {

    const postId = req.params.id.trim();
    const userId = req.body.userId.trim();

    if (!postId || !userId) return res.status(403).json('postId and userId is required');

    try {
        const post = await Post.findById(postId);

        if (!post) return res.status(403).json('Post not found');

        if (post.userId !== userId) return res.status(403).json('Only owners can delete their posts');

        await Post.findByIdAndDelete(postId);

        res.status(200).json('Post has been deleted succesfully');

    } catch (err) {
        res.status(500).json(err);
    }
})


//GET A POST
router.get('/get/:id', async (req, res) => {

    const postId = req.params.id.trim();

    if (!postId) return res.status(403).json('postId is required');

    try {
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json('User not found');

        res.status(200).json(post);

    } catch (err) {
        res.status(500).json(err);
    }
})


//GET USER'S ALL POSTS
router.get('/getAllForUser', async (req, res) => {

    const userId = req.body.userId.trim();

    if (!userId) return res.status(403).json('userId is required');

    try {
        const posts = await Post.find({ userId: userId });

        res.status(200).json({ posts: posts });

    } catch (err) {
        res.status(500).json(err);
    }
})


//LIKE A POST
router.put('/like/:id', async (req, res) => {

    const postId = req.params.id.trim();
    const userId = req.body.userId.trim();

    if (!postId || !userId) return res.status(403).json('postId and userId is required');

    try {
        const post = await Post.findById(postId);

        if (!post) return res.status(403).json('Post not found');

        //Dislikes post if already liked
        if (post.likes.includes(userId)) {
            await post.updateOne({ $pull: { likes: userId } });
            return res.status(403).json('Post has been disliked succesfully');
        }

        await post.updateOne({ $push: { likes: userId } });
        res.status(200).json('Post has been liked succesfully');

    } catch (err) {
        res.status(500).json(err);
    }
})


//GET USER'S TIMELINE POSTS
router.get('/getTimelinePostsForUser', async (req, res) => {

    const userId = req.body.userId.trim();

    if (!userId) return res.status(403).json('userId is required');

    try {

        const currentUser = await User.findById(userId);

        const followingsPosts = await Promise.all(
            currentUser.followings.map(followingUserId => {
                return Post.find({ userId: followingUserId });
            })
        )

        res.status(200).json({ posts: followingsPosts.flat() });
    } catch (err) {
        res.status(500).json(err);
    }
})



module.exports = router;
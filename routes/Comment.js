const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');


//ADD A COMMENT
router.post('/add/:id', async (req, res) => {

    const postId = req.params.id && req.params.id.trim();
    const userId = req.body.userId && req.body.userId.trim();
    const description = req.body.description;
    const descriptionLength = description ? description.trim().length : 0;

    if (!postId || !userId || descriptionLength === 0) return res.status(403).json('postId, userId and description is required');

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json('Post not found');

    const postOwner = await User.findById(post.userId);

    if (!postOwner.followers.includes(userId) && postOwner.id !== userId) return res.status(403).json('Only followers can comment')

    try {
        const comment = new Comment({
            postId: postId,
            userId: userId,
            description: description,
        });

        const createdComment = await comment.save();

        await post.updateOne({ $push: { comments: comment.id } });

        res.status(200).json(createdComment);
    } catch (err) {
        res.status(500).json(err);
    }
})


//GET A COMMENT
router.get('/get/:id', async (req, res) => {

    const commentId = req.params.id && req.params.id.trim();

    if (!commentId) return res.status(403).json('commentId is required');

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) return res.status(404).json('Comment not found');

        res.status(200).json(comment);

    } catch (err) {
        res.status(500).json(err);
    }
})


//UPDATE A COMMENT
router.put('/update/:id', async (req, res) => {

    const commentId = req.params.id && req.params.id.trim();
    const postId = req.body.postId && req.body.postId.trim();
    const userId = req.body.userId && req.body.userId.trim();
    const description = req.body.description;
    const descriptionLength = description ? description.trim().length : 0;

    if (!postId || !userId || !commentId || !description) return res.status(403).json('postId, userId, commentId, and description is required');


    try {
        const comment = await Comment.findById(commentId);

        if (!comment) return res.status(403).json('Comment not found');

        if (descriptionLength === 0) return res.status(403).json('Description is required');

        if (comment.userId !== userId) return res.status(403).json('Only owners can update their comments');

        await Comment.findByIdAndUpdate(commentId, {
            $set: req.body
        });

        res.status(200).json('Comment has been updated succesfully');

    } catch (err) {
        res.status(500).json(err);
    }
})


//DELETE A COMMENT
router.delete('/delete/:id', async (req, res) => {

    const commentId = req.params.id && req.params.id.trim();
    const userId = req.body.userId && req.body.userId.trim();
    const postId = req.body.postId && req.body.postId.trim();

    if (!userId || !commentId || !postId) return res.status(403).json('commentId, postId and userId is required');

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) return res.status(404).json('Comment not found');

        const post = await Post.findById(postId);

        if (!post) return res.status(404).json('Post not found');

        if (comment.userId !== userId && comment.userId !== post.userId) return res.status(403).json('Only owners of the post and comment can delete their comments');

        await post.updateOne({ $pull: { comments: comment.id } });

        await comment.delete();

        res.status(200).json('Comment has been deleted succesfully');

    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
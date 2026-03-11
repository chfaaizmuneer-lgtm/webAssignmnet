const Comment = require('../models/Comment');
const Post = require('../models/Post');

/**
 * GET /api/comments/:postId
 * Get all comments for a post
 */
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name avatar')
      .sort('-createdAt');
    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/comments/:postId
 * Add a comment to a post
 */
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      content: req.body.content
    });

    await comment.populate('author', 'name avatar');
    res.status(201).json({ success: true, comment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/comments/:id
 * Delete a comment
 */
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found.' });

    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

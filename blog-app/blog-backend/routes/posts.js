const express = require('express');
const router = express.Router();
const {
  getPosts, getPost, createPost, updatePost, deletePost,
  toggleLike, getFeaturedPosts, getAdminPosts
} = require('../controllers/postController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getPosts);
router.get('/featured', getFeaturedPosts);
router.get('/admin/all', protect, adminOnly, getAdminPosts);
router.get('/:slug', getPost);

// Protected routes (require login)
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, toggleLike);

module.exports = router;

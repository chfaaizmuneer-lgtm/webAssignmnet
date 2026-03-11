const Post = require('../models/Post');

/**
 * GET /api/posts
 * Get all posts with search, filter, pagination
 */
exports.getPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      category,
      search,
      tag,
      sort = '-createdAt'
    } = req.query;

    // Build query object
    const query = { published: true };

    if (category && category !== 'All') query.category = category;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .populate('comments')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      posts,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/posts/featured
 * Get featured (most-viewed) posts
 */
exports.getFeaturedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ published: true })
      .populate('author', 'name avatar')
      .sort('-views')
      .limit(5)
      .lean();
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/posts/:slug
 * Get single post by slug (increments view count)
 */
exports.getPost = async (req, res) => {
  try {
    // Try finding by slug first, then by ID
    let post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar bio')
      .populate('comments');

    if (!post) {
      post = await Post.findById(req.params.slug)
        .populate('author', 'name avatar bio')
        .populate('comments');
    }

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    // Increment view count
    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

    // Get related posts (same category)
    const related = await Post.find({
      _id: { $ne: post._id },
      category: post.category,
      published: true
    })
      .populate('author', 'name avatar')
      .limit(3)
      .lean();

    res.json({ success: true, post, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/posts
 * Create a new post (auth required)
 */
exports.createPost = async (req, res) => {
  try {
    const postData = { ...req.body, author: req.user._id };
    const post = await Post.create(postData);
    await post.populate('author', 'name avatar');
    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/posts/:id
 * Update a post (auth required — author or admin only)
 */
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    // Ensure only the author or admin can update
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this post.' });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'name avatar');

    res.json({ success: true, post });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/posts/:id
 * Delete a post (auth required — author or admin only)
 */
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post.' });
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/posts/:id/like
 * Toggle like on a post (auth required)
 */
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    const userId = req.user._id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ success: true, likes: post.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/posts/admin/all
 * Get ALL posts for admin dashboard (no filter)
 */
exports.getAdminPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await Post.countDocuments();
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const stats = {
      total,
      published: await Post.countDocuments({ published: true }),
      totalViews: await Post.aggregate([{ $group: { _id: null, sum: { $sum: '$views' } } }])
        .then(r => r[0]?.sum || 0),
      categories: await Post.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    };

    res.json({ success: true, posts, stats, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

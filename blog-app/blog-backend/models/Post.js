const mongoose = require('mongoose');
const slugify = require('slugify');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    slug: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [300, 'Description cannot exceed 300 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    featuredImage: {
      type: String,
      default: ''
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Technology', 'Design', 'Development', 'Business',
        'Lifestyle', 'Health', 'Travel', 'Food', 'Science', 'Other'
      ]
    },
    tags: {
      type: [String],
      default: []
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    views: {
      type: Number,
      default: 0
    },
    readingTime: {
      type: Number, // in minutes
      default: 1
    },
    published: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for comment count
PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true
});

// Auto-generate slug from title
PostSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) +
      '-' + Date.now().toString().slice(-4);
  }
  // Auto-calculate reading time (avg 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  next();
});

// Text search index
PostSchema.index({ title: 'text', description: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Post', PostSchema);

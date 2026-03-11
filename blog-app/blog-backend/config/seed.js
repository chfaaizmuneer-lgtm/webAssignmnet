/**
 * Seed Script — Populate the database with sample data
 * Run: npm run seed
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const SAMPLE_POSTS = [
  {
    title: 'The Future of AI: How Machine Learning is Reshaping Our World',
    description: 'Explore how artificial intelligence and machine learning are transforming industries, from healthcare to finance, and what this means for the future.',
    content: `<h2>Introduction</h2><p>Artificial intelligence is no longer a futuristic concept confined to science fiction. It's here, it's real, and it's transforming the world at an unprecedented pace.</p><h2>Healthcare Revolution</h2><p>AI is diagnosing diseases with accuracy that rivals experienced physicians. Deep learning models analyze medical images to detect cancers earlier than ever before.</p><h2>The Road Ahead</h2><p>As we continue to develop more sophisticated AI systems, the key challenge will be ensuring these technologies are developed ethically and accessibly.</p>`,
    category: 'Technology',
    tags: ['AI', 'Machine Learning', 'Future', 'Technology'],
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format',
    views: 1240
  },
  {
    title: 'Mastering Modern CSS: A Deep Dive into Grid and Flexbox',
    description: 'A comprehensive guide to CSS Grid and Flexbox that will transform how you build layouts.',
    content: `<h2>Why Modern CSS Matters</h2><p>Gone are the days of float-based layouts and clearfixes. Modern CSS gives us powerful tools to create complex, responsive layouts with minimal code.</p><h2>CSS Grid</h2><p>Grid is a two-dimensional layout system that lets you control rows and columns simultaneously. It's perfect for page-level layouts.</p><h2>Flexbox</h2><p>Flexbox excels at one-dimensional layouts — either a row or a column. It's your go-to for navigation bars, card rows, and centering elements.</p>`,
    category: 'Development',
    tags: ['CSS', 'Web Development', 'Design', 'Frontend'],
    featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format',
    views: 892
  },
  {
    title: 'Design Systems: Building Consistent UIs at Scale',
    description: 'Learn how top companies like Airbnb, Google, and Shopify build and maintain design systems that keep their products consistent.',
    content: `<h2>What is a Design System?</h2><p>A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.</p><h2>Core Components</h2><p>Every robust design system includes a color palette, typography scale, spacing system, and component library.</p><h2>Implementation Tips</h2><p>Start small with the most-used components. Document everything. Version your system like software.</p>`,
    category: 'Design',
    tags: ['Design System', 'UI', 'UX', 'Components'],
    featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format',
    views: 756
  },
  {
    title: 'Remote Work in 2024: Building Healthy Habits for the Home Office',
    description: 'Practical strategies for staying productive, healthy, and connected while working remotely.',
    content: `<h2>The New Normal</h2><p>Remote work has shifted from a perk to the standard for millions of knowledge workers. But working from home comes with unique challenges.</p><h2>Creating Your Space</h2><p>Dedicate a specific area to work. Even in a small apartment, having a consistent work spot signals to your brain that it's time to focus.</p><h2>Staying Connected</h2><p>Over-communicate with your team. Use video calls for nuanced conversations. Create virtual water-cooler moments.</p>`,
    category: 'Lifestyle',
    tags: ['Remote Work', 'Productivity', 'Work-Life Balance'],
    featuredImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format',
    views: 623
  },
  {
    title: 'The Startup Founder\'s Guide to Product-Market Fit',
    description: 'How to know when you\'ve found product-market fit — and what to do before and after you find it.',
    content: `<h2>Defining Product-Market Fit</h2><p>Marc Andreessen defined it as "being in a good market with a product that can satisfy that market." But what does this actually look like?</p><h2>How to Measure It</h2><p>The "40% rule": If at least 40% of your users say they'd be very disappointed without your product, you likely have PMF.</p><h2>After PMF</h2><p>Once you've found it, pour fuel on the fire. This is when you scale marketing, hiring, and infrastructure.</p>`,
    category: 'Business',
    tags: ['Startup', 'Business', 'Entrepreneurship', 'Product'],
    featuredImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format',
    views: 511
  },
  {
    title: 'Next.js 14: Everything You Need to Know About the App Router',
    description: 'A comprehensive walkthrough of Next.js 14 features — App Router, Server Components, and streaming.',
    content: `<h2>App Router vs Pages Router</h2><p>Next.js 14 fully embraces React Server Components with the App Router. It's a paradigm shift that changes how you think about data fetching.</p><h2>Server Components</h2><p>By default, components in the app directory are server components. They render on the server, reducing JavaScript sent to the client.</p><h2>Streaming and Suspense</h2><p>Loading UI and streaming let you progressively render your page, showing content as it becomes available.</p>`,
    category: 'Development',
    tags: ['Next.js', 'React', 'JavaScript', 'Web Development'],
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format',
    views: 1089
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), Post.deleteMany(), Comment.deleteMany()]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Alex Morgan',
      email: 'admin@blogapp.com',
      password: 'admin123',
      role: 'admin',
      bio: 'Founder and lead writer at The Blog. Passionate about technology and design.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
    });

    // Create regular user
    const user = await User.create({
      name: 'Jordan Lee',
      email: 'user@blogapp.com',
      password: 'user123',
      bio: 'Software engineer and writer.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
    });

    console.log('👥 Created users');

    // Create posts (alternate between admin and user)
    const posts = [];
    for (let i = 0; i < SAMPLE_POSTS.length; i++) {
      const post = await Post.create({
        ...SAMPLE_POSTS[i],
        author: i % 2 === 0 ? admin._id : user._id,
        likes: i % 3 === 0 ? [admin._id, user._id] : [admin._id]
      });
      posts.push(post);
    }

    console.log(`📝 Created ${posts.length} posts`);

    // Add comments
    await Comment.create([
      { post: posts[0]._id, author: user._id, content: 'Great overview of AI trends! The healthcare section was especially insightful.' },
      { post: posts[0]._id, author: admin._id, content: 'Thanks! The pace of AI development in healthcare is truly remarkable.' },
      { post: posts[1]._id, author: user._id, content: 'Finally a CSS guide that explains Grid vs Flexbox clearly. Bookmarked!' },
      { post: posts[2]._id, author: admin._id, content: 'Design systems are such a game-changer for team collaboration.' }
    ]);

    console.log('💬 Added comments');
    console.log('\n✅ Seeding complete!');
    console.log('─────────────────────');
    console.log('Admin: admin@blogapp.com / admin123');
    console.log('User:  user@blogapp.com  / user123');
    console.log('─────────────────────');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();

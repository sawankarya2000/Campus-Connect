const multer = require('multer');
const sharp = require('sharp');

const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

//Multer storage engine to store uploaded files
const multerStorage = multer.memoryStorage();

//Multer filter to only accept image files
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    return cb(new Error('File type not supported'), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPhoto = upload.single('file');

exports.resizePhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `post-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 80 })
    .toFile(`public/img/posts/${req.file.filename}`);

  delete req.file.buffer;
  next();
};

exports.createPost = async (req, res) => {
  //If file exist add it in request body
  if (req.file) {
    req.body.media = req.file.filename;
  }

  const post = await Post.create({
    author: req.user._id,
    text: req.body.text,
    media: req.body.media,
  });

  // Update User's posts array
  await req.user.posts.push(post._id);
  await req.user.save();

  return res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found',
      });
    }

    //Delete all the comments of the post then delete post
    await Comment.deleteMany({ post: req.params.id });
    await Post.findByIdAndDelete(req.params.id);

    //Remove the post from the user's posts array
    await req.user.posts.pull(req.params.id);
    await req.user.save();

    return res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author')
      .populate('comments');

    console.log(post);
    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
exports.getPostByUser = async (req, res) => {
  try {
    const post = await Post.find({ author: req.params.id })
      .populate('author')
      .populate('comments');

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found',
      });
    }

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Post already liked',
      });
    }

    post.likes.push(req.user.id);
    post.totalLikes += 1; // Increase the like count by 1
    await post.save(); // Save the updated post to the database

    return res.status(200).json({
      status: 'success',
      message: 'Post liked',
      data: {
        post,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.comment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found',
      });
    }
    //Create Comment
    const comment = await Comment.create({
      author: req.user._id,
      post: post._id,
      text: req.body.text,
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(200).json({
      status: 'success',
      message: 'Comment added',
      data: {
        comment,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      // message: 'Internal server error',
      message: error.message,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'firstName lastName photo')
      .populate('comments')
      .sort({ createdAt: -1 });
    return res.status(200).json({
      status: 'success',
      data: {
        posts,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

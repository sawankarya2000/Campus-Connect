const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/',
  authController.protect,
  postController.uploadPhoto,
  postController.resizePhoto,
  postController.createPost
);
router.get('/:id', authController.protect, postController.getPost);
router.delete('/:id', authController.protect, postController.deletePost);

router.patch('/:id/like', authController.protect, postController.likePost);
router.patch('/:id/comment', authController.protect, postController.comment);

module.exports = router;

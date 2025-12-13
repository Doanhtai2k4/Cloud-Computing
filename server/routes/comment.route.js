const express = require('express');
const router = express.Router();
const {
    createCommentController,
    getCommentsByBlogController,
    deleteCommentController
} = require('../controllers/comment.controller');
const { requireSignIn } = require('../middlewares/middleware');

// POST /api/v1/comments - Tạo comment mới (cần auth)
router.post('/', requireSignIn, createCommentController);

// GET /api/v1/comments/:blogId - Lấy tất cả comments của blog
router.get('/:blogId', getCommentsByBlogController);

// DELETE /api/v1/comments/:id - Xóa comment (cần auth)
router.delete('/:id', requireSignIn, deleteCommentController);

module.exports = router;

const Comment = require('../models/comment.model');

// Tạo comment mới
const createCommentController = async (req, res) => {
    try {
        const { content, blogId, parentId } = req.body;
        const userId = req.user._id; // Lấy từ middleware authentication

        if (!content || !blogId) {
            return res.status(400).json({
                success: false,
                message: 'Content and blogId are required'
            });
        }

        const newComment = await Comment.create({
            content,
            userId,
            blogId,
            parentId: parentId || null
        });

        // Populate user info để trả về
        const populatedComment = await Comment.findById(newComment._id)
            .populate('userId', 'name email')
            .lean();

        return res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            data: populatedComment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating comment',
            error: error.message
        });
    }
};

// Lấy tất cả comments của 1 blog (bao gồm nested replies)
const getCommentsByBlogController = async (req, res) => {
    try {
        const { blogId } = req.params;

        // Lấy tất cả comments không bị xóa
        const comments = await Comment.find({ 
            blogId, 
            isDeleted: false 
        })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .lean();

        // Organize comments into tree structure
        const commentMap = {};
        const topLevelComments = [];

        comments.forEach(comment => {
            commentMap[comment._id] = { ...comment, replies: [] };
        });

        comments.forEach(comment => {
            if (comment.parentId) {
                // Đây là reply, thêm vào replies của parent
                if (commentMap[comment.parentId]) {
                    commentMap[comment.parentId].replies.push(commentMap[comment._id]);
                }
            } else {
                // Đây là top-level comment
                topLevelComments.push(commentMap[comment._id]);
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Comments fetched successfully',
            data: topLevelComments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching comments',
            error: error.message
        });
    }
};

// Xóa comment (soft delete)
const deleteCommentController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Debug log
        console.log('Delete comment check:', {
            commentUserId: comment.userId.toString(),
            currentUserId: userId.toString(),
            userRole: req.user.role,
            isOwner: comment.userId.toString() === userId.toString(),
            isAdmin: req.user.role === 1
        });

        // Kiểm tra quyền: chỉ owner hoặc admin mới xóa được
        if (comment.userId.toString() !== userId.toString() && req.user.role !== 1) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this comment'
            });
        }

        // Soft delete
        comment.isDeleted = true;
        await comment.save();

        return res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
            data: comment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting comment',
            error: error.message
        });
    }
};

// Like/Unlike comment
const likeCommentController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if user already liked
        const userIdString = userId.toString();
        const likeIndex = comment.likes.findIndex(likeId => likeId.toString() === userIdString);
        
        if (likeIndex > -1) {
            // Unlike - remove userId
            comment.likes.splice(likeIndex, 1);
        } else {
            // Like - add userId
            comment.likes.push(userId);
        }

        await comment.save();

        return res.status(200).json({
            success: true,
            message: likeIndex > -1 ? 'Comment unliked successfully' : 'Comment liked successfully',
            data: {
                commentId: comment._id,
                likes: comment.likes,
                likeCount: comment.likes.length,
                isLiked: likeIndex === -1
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error toggling like',
            error: error.message
        });
    }
};

module.exports = {
    createCommentController,
    getCommentsByBlogController,
    deleteCommentController,
    likeCommentController
};

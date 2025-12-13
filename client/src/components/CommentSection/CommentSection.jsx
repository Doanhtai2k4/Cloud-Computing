import { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { DeleteOutlined, MessageOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import styles from './CommentSection.module.css';

const API_URL = import.meta.env.VITE_API;
const { TextArea } = Input;

const CommentSection = ({ blogId }) => {
    const [auth] = useAuth();
    const user = auth?.user;
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    // Fetch comments khi component mount
    useEffect(() => {
        if (blogId) {
            fetchComments();
        }
    }, [blogId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/v1/comments/${blogId}`);
            if (response.data.success) {
                setComments(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!user) {
            message.warning('Vui lòng đăng nhập để bình luận');
            return;
        }

        if (!commentText.trim()) {
            message.warning('Vui lòng nhập nội dung bình luận');
            return;
        }

        try {
            const authData = JSON.parse(localStorage.getItem('auth') || '{}');
            const token = authData.token;
            const response = await axios.post(
                `${API_URL}/api/v1/comments`,
                {
                    content: commentText,
                    blogId,
                    parentId: null
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            if (response.data.success) {
                message.success('Bình luận thành công');
                setCommentText('');
                fetchComments();
            }
        } catch (error) {
            message.error('Lỗi khi gửi bình luận');
            console.error(error);
        }
    };

    const handleSubmitReply = async (parentId) => {
        if (!user) {
            message.warning('Vui lòng đăng nhập để trả lời');
            return;
        }

        if (!replyText.trim()) {
            message.warning('Vui lòng nhập nội dung trả lời');
            return;
        }

        try {
            const authData = JSON.parse(localStorage.getItem('auth') || '{}');
            const token = authData.token;
            const response = await axios.post(
                `${API_URL}/api/v1/comments`,
                {
                    content: replyText,
                    blogId,
                    parentId
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            if (response.data.success) {
                message.success('Trả lời thành công');
                setReplyText('');
                setReplyTo(null);
                fetchComments();
            }
        } catch (error) {
            message.error('Lỗi khi gửi trả lời');
            console.error(error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!user) {
            message.warning('Vui lòng đăng nhập');
            return;
        }

        try {
            const authData = JSON.parse(localStorage.getItem('auth') || '{}');
            const token = authData.token;
            const response = await axios.delete(
                `${API_URL}/api/v1/comments/${commentId}`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            if (response.data.success) {
                message.success('Xóa bình luận thành công');
                fetchComments();
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Lỗi khi xóa bình luận');
            console.error(error);
        }
    };

    const handleLikeComment = async (commentId) => {
        if (!user) {
            message.warning('Vui lòng đăng nhập để thích bình luận');
            return;
        }

        try {
            const authData = JSON.parse(localStorage.getItem('auth') || '{}');
            const token = authData.token;
            const response = await axios.post(
                `${API_URL}/api/v1/comments/${commentId}/like`,
                {},
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            if (response.data.success) {
                fetchComments(); // Refresh để update likes
            }
        } catch (error) {
            message.error('Lỗi khi thích bình luận');
            console.error(error);
        }
    };

    const renderComment = (comment, isReply = false) => {
        const isOwner = user && comment.userId._id === user._id;
        const isAdmin = user && (user.role === 1 || user.role === 'admin');
        const canDelete = isOwner || isAdmin;
        
        // Check if current user liked this comment
        const isLiked = user && comment.likes && comment.likes.includes(user._id);
        const likeCount = comment.likes ? comment.likes.length : 0;

        return (
            <div key={comment._id} className={isReply ? styles.replyComment : styles.comment}>
                <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>{comment.userId.name}</span>
                    <span className={styles.commentDate}>
                        {new Date(comment.createdAt).toLocaleString('vi-VN')}
                    </span>
                </div>
                
                <p className={styles.commentContent}>{comment.content}</p>
                
                <div className={styles.commentActions}>
                    <Button
                        type="link"
                        size="small"
                        icon={isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                        onClick={() => handleLikeComment(comment._id)}
                        className={styles.likeButton}
                    >
                        {likeCount > 0 && <span className={styles.likeCount}>{likeCount}</span>}
                    </Button>
                    
                    <Button
                        type="link"
                        size="small"
                        icon={<MessageOutlined />}
                        onClick={() => setReplyTo(comment._id)}
                    >
                        Trả lời
                    </Button>
                    
                    {canDelete && (
                        <Button
                            type="link"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteComment(comment._id)}
                        >
                            Xóa
                        </Button>
                    )}
                </div>

                {/* Reply form */}
                {replyTo === comment._id && (
                    <div className={styles.replyForm}>
                        <TextArea
                            rows={3}
                            placeholder="Nhập câu trả lời..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            maxLength={1000}
                        />
                        <div className={styles.replyActions}>
                            <Button size="small" onClick={() => setReplyTo(null)}>
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => handleSubmitReply(comment._id)}
                            >
                                Gửi
                            </Button>
                        </div>
                    </div>
                )}

                {/* Nested replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className={styles.repliesContainer}>
                        {comment.replies.map(reply => renderComment(reply, true))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.commentSection}>
            <h3 className={styles.sectionTitle}>Bình luận ({comments.length})</h3>

            {/* Comment input form */}
            {user ? (
                <div className={styles.commentForm}>
                    <TextArea
                        rows={4}
                        placeholder="Viết bình luận của bạn..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        maxLength={1000}
                    />
                    <Button
                        type="primary"
                        onClick={handleSubmitComment}
                        className={styles.submitButton}
                    >
                        Gửi bình luận
                    </Button>
                </div>
            ) : (
                <p className={styles.loginPrompt}>
                    Vui lòng đăng nhập để bình luận
                </p>
            )}

            {/* Comments list */}
            <div className={styles.commentsList}>
                {loading ? (
                    <p>Đang tải bình luận...</p>
                ) : comments.length === 0 ? (
                    <p className={styles.noComments}>Chưa có bình luận nào</p>
                ) : (
                    comments.map(comment => renderComment(comment))
                )}
            </div>
        </div>
    );
};

export default CommentSection;

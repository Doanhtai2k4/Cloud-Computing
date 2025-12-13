import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookFilled, DeleteOutlined } from '@ant-design/icons';
import { message, Empty } from 'antd';
import Layout from '../../components/Layout/Layout';
import styles from './SavedPosts.module.css';

const API_URL = import.meta.env.VITE_API;

const SavedPosts = () => {
    const navigate = useNavigate();
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    const fetchSavedPosts = async () => {
        try {
            const authData = localStorage.getItem('auth');
            if (!authData) {
                alert('Vui lòng đăng nhập');
                navigate('/login');
                return;
            }

            const { token } = JSON.parse(authData);
            if (!token) {
                alert('Vui lòng đăng nhập');
                navigate('/login');
                return;
            }

            const response = await axios.get(`${API_URL}/api/v1/auth/saved-posts`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setSavedPosts(response.data.savedPosts);
            }
        } catch (error) {
            alert('Lỗi khi tải bài viết đã lưu');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveBookmark = async (e, postId) => {
        e.stopPropagation();
        e.preventDefault();

        try {
            const authData = localStorage.getItem('auth');
            if (!authData) return;
            
            const { token } = JSON.parse(authData);
            const response = await axios.post(
                `${API_URL}/api/v1/auth/bookmark/${postId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                alert('Đã bỏ lưu bài viết');
                setSavedPosts(savedPosts.filter(post => post._id !== postId));
            }
        } catch (error) {
            alert('Lỗi khi bỏ lưu bài viết');
        }
    };

    const handleClickToBlog = (blog) => {
        navigate(`/blog/${blog._id}`, { state: blog });
    };

    if (loading) {
        return (
            <Layout>
                <div className={styles.loading}>Đang tải...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={styles.savedPostsContainer}>
                <div className={styles.header}>
                    <h1><BookFilled style={{ color: '#4096ff', marginRight: '12px' }} />Bài viết đã lưu</h1>
                    <p>Danh sách {savedPosts.length} bài viết bạn đã lưu</p>
                </div>

                {savedPosts.length === 0 ? (
                    <Empty
                        description="Chưa có bài viết nào được lưu"
                        style={{ marginTop: '60px' }}
                    />
                ) : (
                    <div className={styles.postsGrid}>
                        {savedPosts.map((post) => (
                            <div
                                key={post._id}
                                className={styles.postCard}
                                onClick={() => handleClickToBlog(post)}
                            >
                                <div
                                    className={styles.removeIcon}
                                    onClick={(e) => handleRemoveBookmark(e, post._id)}
                                >
                                    <DeleteOutlined style={{ fontSize: '18px', color: '#ff4d4f' }} />
                                </div>
                                <img src={post.image} alt={post.title} />
                                <div className={styles.postContent}>
                                    <h3>{post.title}</h3>
                                    <p className={styles.description}>
                                        {post.description?.substring(0, 120)}...
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default SavedPosts;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BookOutlined, BookFilled } from '@ant-design/icons';
import { message } from 'antd';
import styles from './BlogLanguages.module.css';
const API_URL = import.meta.env.VITE_API; // Lấy URL API từ biến môi trường

const BlogLanguages = () => {
    const navigate = useNavigate(); 
    const { id } = useParams();
    const [blogLanguages, setBlogLanguages] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);

    useEffect(() => {
        const getBlogLanguages = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/blog/blogLanguages`);
                setBlogLanguages(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        const getSavedPosts = async () => {
            try {
                const authData = localStorage.getItem('auth');
                if (authData) {
                    const { token } = JSON.parse(authData);
                    const response = await axios.get(`${API_URL}/api/v1/auth/saved-posts`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        setSavedPosts(response.data.savedPosts.map(post => post._id));
                    }
                }
            } catch (error) {
                console.log('Error fetching saved posts:', error);
            }
        };

        getBlogLanguages();
        getSavedPosts();
    }, []);

    const handleClickToBlog = (blog) => {
        navigate(`/blog/${blog._id}`, { state: blog }); // truyền blog qua location.state
    };

    const handleBookmark = async (e, postId) => {
        e.stopPropagation();
        e.preventDefault();
        
        const authData = localStorage.getItem('auth');
        if (!authData) {
            message.warning('Vui lòng đăng nhập để lưu bài viết');
            navigate('/login');
            return;
        }

        const { token } = JSON.parse(authData);
        if (!token) {
            message.warning('Vui lòng đăng nhập để lưu bài viết');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}/api/v1/auth/bookmark/${postId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                // Show success notification
                alert(response.data.message);
                console.log('✅ Bookmark success:', response.data);
                
                // Update savedPosts state immediately
                if (response.data.isBookmarked) {
                    setSavedPosts([...savedPosts, postId]);
                } else {
                    setSavedPosts(savedPosts.filter(id => id !== postId));
                }
            }
        } catch (error) {
            message.error('Lỗi khi lưu bài viết');
            console.log(error);
        }
    };

    return (
        <div className={styles.blogLanguagesContainer}>
            {blogLanguages.map((blog) => {
                const isBookmarked = savedPosts.includes(blog._id);
                
                return (
                    <div key={blog._id} className={styles.blogCardIn} onClick={() => handleClickToBlog(blog)}>
                        <div className={styles.bookmarkIcon} onClick={(e) => handleBookmark(e, blog._id)}>
                            {isBookmarked ? (
                                <BookFilled style={{ color: '#52c41a', fontSize: '20px' }} />
                            ) : (
                                <BookOutlined style={{ fontSize: '20px' }} />
                            )}
                        </div>
                        <img src={blog.image} alt={blog.title} />
                        <h4>{blog.title.substring(0, 70)}...</h4>
                    </div>
                );
            })}
        </div>
    );
}

export default BlogLanguages

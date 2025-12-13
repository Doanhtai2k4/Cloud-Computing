import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Input, Select, Card, Empty, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Layout from '../../components/Layout/Layout';
import styles from './SearchPage.module.css';

const API_URL = import.meta.env.VITE_API;
const { Search } = Input;
const { Option } = Select;

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

    useEffect(() => {
        if (keyword) {
            searchBlogs();
        }
    }, [keyword, sort, searchParams]);

    const searchBlogs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (keyword) params.append('keyword', keyword);
            if (sort) params.append('sort', sort);

            const response = await axios.get(`${API_URL}/api/v1/blog/search?${params.toString()}`);
            setBlogs(response.data.data);
        } catch (error) {
            console.log('Error searching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setKeyword(value);
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('keyword', value);
        } else {
            params.delete('keyword');
        }
        setSearchParams(params);
    };

    const handleSortChange = (value) => {
        setSort(value);
        const params = new URLSearchParams(searchParams);
        params.set('sort', value);
        setSearchParams(params);
    };

    const handleClickToBlog = (blog) => {
        navigate(`/blog/${blog._id}`, { state: blog });
    };

    return (
        <Layout>
            <div className={styles.searchContainer}>
                <div className={styles.searchHeader}>
                    <h1>Tìm kiếm bài viết</h1>
                    <Search
                        placeholder="Nhập từ khóa tìm kiếm..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        defaultValue={keyword}
                        onSearch={handleSearch}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filters}>
                    <Select
                        placeholder="Sắp xếp"
                        style={{ width: 200 }}
                        value={sort}
                        onChange={handleSortChange}
                    >
                        <Option value="newest">Mới nhất</Option>
                        <Option value="oldest">Cũ nhất</Option>
                        <Option value="title">Theo tiêu đề</Option>
                    </Select>
                </div>

                <div className={styles.resultsCount}>
                    {!loading && blogs.length > 0 && (
                        <p>Tìm thấy <strong>{blogs.length}</strong> kết quả</p>
                    )}
                </div>

                {loading ? (
                    <div className={styles.loading}>
                        <Spin size="large" />
                    </div>
                ) : blogs.length > 0 ? (
                    <div className={styles.resultsGrid}>
                        {blogs.map(blog => (
                            <Card
                                key={blog._id}
                                hoverable
                                cover={<img alt={blog.title} src={blog.image} />}
                                onClick={() => handleClickToBlog(blog)}
                                className={styles.blogCard}
                            >
                                <Card.Meta
                                    title={blog.title.substring(0, 70) + '...'}
                                    description={
                                        <div dangerouslySetInnerHTML={{ 
                                            __html: blog.content.substring(0, 100) + '...' 
                                        }} />
                                    }
                                />
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Empty
                        description="Không tìm thấy kết quả nào"
                        className={styles.empty}
                    />
                )}
            </div>
        </Layout>
    );
};

export default SearchPage;

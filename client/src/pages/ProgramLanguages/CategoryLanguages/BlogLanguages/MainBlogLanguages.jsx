import { useLocation } from "react-router-dom";
import Layout from "../../../../components/Layout/Layout";
import CommentSection from "../../../../components/CommentSection/CommentSection";
import styles from "./BlogLanguages.module.css"; 

const MainBlogLanguages = () => {
    const location = useLocation();
    const blog = location.state;

    if (!blog) return <p>Không có dữ liệu blog.</p>;

    return (
        <Layout>
           <div className={styles.containerMainBlogLanguages}>
                 <h2>{blog.title}</h2>
            <img src={blog.image} alt={blog.title} />
            <div className={styles.blogContent} dangerouslySetInnerHTML={{ __html: blog.content }} />
            
            {/* Comment Section */}
            <CommentSection blogId={blog._id} />
           </div>
        </Layout>
    );
};

export default MainBlogLanguages;

import { useLocation } from "react-router-dom";
import Layout from "../../../../components/Layout/Layout";
import CommentSection from "../../../../components/CommentSection/CommentSection";
import ShareButtons from "../../../../components/ShareButtons/ShareButtons";
import styles from "./BlogLanguages.module.css"; 

const MainBlogLanguages = () => {
    const location = useLocation();
    const blog = location.state;

    if (!blog) return <p>Không có dữ liệu blog.</p>;

    // Get blog description from content (first 150 chars without HTML)
    const getDescription = () => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = blog.content;
        const text = tempDiv.textContent || tempDiv.innerText || '';
        return text.substring(0, 150);
    };

    return (
        <Layout>
           <div className={styles.containerMainBlogLanguages}>
                 <h2>{blog.title}</h2>
            <img src={blog.image} alt={blog.title} />
            
            {/* Share Buttons */}
            <div className={styles.shareSection}>
                <ShareButtons 
                    url={window.location.href}
                    title={blog.title}
                    description={getDescription()}
                />
            </div>
            
            <div className={styles.blogContent} dangerouslySetInnerHTML={{ __html: blog.content }} />
            
            {/* Comment Section */}
            <CommentSection blogId={blog._id} />
           </div>
        </Layout>
    );
};

export default MainBlogLanguages;

import styles from './SkeletonLoader.module.css';

export const CardSkeleton = () => (
  <div className={`${styles.card} ${styles.skeleton}`}>
    <div className={styles.cardImage}></div>
    <div className={styles.cardContent}>
      <div className={`${styles.line} ${styles.title}`}></div>
      <div className={styles.line}></div>
      <div className={`${styles.line} ${styles.short}`}></div>
    </div>
  </div>
);

export const ListSkeleton = ({ count = 5 }) => (
  <div className={styles.listContainer}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className={`${styles.listItem} ${styles.skeleton}`}>
        <div className={styles.avatar}></div>
        <div className={styles.listContent}>
          <div className={`${styles.line} ${styles.title}`}></div>
          <div className={`${styles.line} ${styles.short}`}></div>
        </div>
      </div>
    ))}
  </div>
);

export const BlogPostSkeleton = () => (
  <div className={`${styles.blogPost} ${styles.skeleton}`}>
    <div className={styles.blogImage}></div>
    <div className={styles.blogContent}>
      <div className={`${styles.line} ${styles.blogTitle}`}></div>
      <div className={styles.line}></div>
      <div className={styles.line}></div>
      <div className={`${styles.line} ${styles.medium}`}></div>
      <div className={styles.blogMeta}>
        <div className={`${styles.line} ${styles.tiny}`}></div>
        <div className={`${styles.line} ${styles.tiny}`}></div>
      </div>
    </div>
  </div>
);

export const GridSkeleton = ({ count = 6 }) => (
  <div className={styles.grid}>
    {Array.from({ length: count }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);

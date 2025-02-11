import styles from "./EmojisSkeleton.module.scss";

const EmojisSkeleton = () => {
  return (
    <div className={styles.skeletonGrid}>
      {[...Array(9)].map((_, index) => (
        <div key={index} className={styles.skeletonCircle}></div>
      ))}
    </div>
  );
};

export default EmojisSkeleton;

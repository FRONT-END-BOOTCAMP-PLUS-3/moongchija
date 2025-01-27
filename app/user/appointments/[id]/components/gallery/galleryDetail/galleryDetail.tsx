"use client";

import styles from "./galleryDetail.module.scss";

const GalleryDetail = () => {
  const photos = [
    { id: 1, src: "", username: "User1" },
    { id: 2, src: "", username: "User2" },
    { id: 3, src: "", username: "User3" },
    { id: 4, src: "", username: "User4" },
    { id: 5, src: "", username: "User5" },
    { id: 6, src: "", username: "User6" },
    { id: 7, src: "", username: "User7" },
    { id: 8, src: "", username: "User8" },
  ];

  return (
    <div>
      <div className={styles.galleryContainer}>
        {photos.map((photo) => (
          <div key={photo.id} className={styles.photoCard}>
            <div
              className={styles.photo}
              style={{
                backgroundImage: photo.src ? `url(${photo.src})` : "none",
                backgroundColor: photo.src ? "transparent" : "#D9D9D9",
              }}
            ></div>
            <div className={styles.userInfo}>
              <div className={styles.userIcon}></div>
              <span className={styles.username}>{photo.username}</span>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default GalleryDetail;

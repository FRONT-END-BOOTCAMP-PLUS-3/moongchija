import styles from "./NoticeDetail.module.scss";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const NoticeDetail = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>공지사항</span>
        <FaPlus className={styles.plusIcon} />
      </div>

      {/* 공지사항 개별 박스 */}
      <div className={styles.wrapper}>
        <div className={styles.box}>
          <div>늦지마요늦지마요늦지마요</div>
          <div className={styles.icons}>
          <FaEdit className={styles.editIcon} />
          <FaTrash className={styles.trashIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;

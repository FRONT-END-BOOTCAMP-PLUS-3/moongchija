import styles from "./NoticeBox.module.scss";
import { FaEdit, FaTrash } from "react-icons/fa";

const NoticeBox = () => {
  return (
    <div className={styles.box}>
      <div>늦지마요늦지마요늦지마요</div>
      <div className={styles.icons}>
        <FaEdit className={styles.editIcon} />
        <FaTrash className={styles.trashIcon} />
      </div>
    </div>
  );
};

export default NoticeBox;

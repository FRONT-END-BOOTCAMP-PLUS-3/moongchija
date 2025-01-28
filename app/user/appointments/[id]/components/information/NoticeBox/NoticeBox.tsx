import Modal from "@/components/modal/Modal";
import styles from "./NoticeBox.module.scss";
import { FaEdit, FaTrash } from "react-icons/fa";
import Button from "@/components/button/Button";
import { useState, useMemo, useRef } from "react";

const NoticeBox = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false); // 더보기 열고 닫는 상태
  const textLimit = useRef(30); // 글자수 제한
  const content =
    "늦지마요늦지마요늦지마요... 다들 늦으면 1분 당 3만원입니다.늦지마요늦지마요늦지마요... 다들 늦으면 1분 당 3만원입니다.늦지마요늦지마요늦지마요... 다들 늦으면 1분 당 3만원입니다.";

  const truncatedContent = useMemo(() => {
    const shortContent = content.slice(0, textLimit.current);

    if (content.length > textLimit.current) {
      return isShowMore ? content : shortContent;
    }
    return content;
  }, [isShowMore, content]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRegister = () => {
    alert("수정되었습니다");
    closeModal();
  };

  const handleDelete = () => {
    const confirmation = confirm("삭제하겠습니까?");
    if (confirmation) {
      alert("삭제되었습니다");
    }
  };

  return (
    <>
      <div className={styles.box}>
        <div className={styles.content}>
          {truncatedContent}
          {content.length > textLimit.current && (
            <span
              className={styles.toggle}
              onClick={() => setIsShowMore(!isShowMore)}
            >
              {isShowMore ? " [접기]" : " ...[더 보기]"}
            </span>
          )}
        </div>
        <div className={styles.icons}>
          <FaEdit className={styles.editIcon} onClick={openModal} />
          <FaTrash className={styles.trashIcon} onClick={handleDelete} />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.modalContainer}>
          <div className={styles.modalBox}>
            <span className={styles.modalTitle}>공지사항 수정하기</span>
            <textarea className={styles.modalContent} defaultValue={content} />
            <div className={styles.editButton}>
              <Button
                text="수정하기"
                size="sm"
                color="--primary-color"
                active={true}
                onClick={handleRegister}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NoticeBox;

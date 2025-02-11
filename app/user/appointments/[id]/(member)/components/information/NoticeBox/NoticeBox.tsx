import Modal from "@/components/modal/Modal";
import styles from "./NoticeBox.module.scss";
import { FaEdit, FaTrash } from "react-icons/fa";
import Button from "@/components/button/Button";
import { useState, useMemo, useRef } from "react";

interface NoticeBoxProps {
  noticeId: number;
  content: string;
  appointmentId: number;
  onNoticeUpdate: (updatedNotice: {
    noticeId: number;
    content: string;
  }) => void;
  onNoticeDelete: (noticeId: number) => void;
  ownerId: string; // 방장 ID
  userId: string | null; // 유저 ID
}

const NoticeBox = ({
  noticeId,
  content,
  appointmentId,
  onNoticeUpdate,
  onNoticeDelete,
  ownerId,
  userId,
}: NoticeBoxProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(content);
  const textLimit = useRef(30);

  const truncatedContent = useMemo(() => {
    const shortContent = content.slice(0, textLimit.current);
    return content.length > textLimit.current
      ? isShowMore
        ? content
        : shortContent
      : content;
  }, [isShowMore, content]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleUpdate = async () => {
    if (!updatedContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `/api/user/appointments/${appointmentId}/information`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noticeId, descript: updatedContent }),
        }
      );

      if (response.ok) {
        alert("공지사항이 수정되었습니다.");
        onNoticeUpdate({ noticeId, content: updatedContent });
        closeModal();
      } else {
        const errorData = await response.json();
        alert(`수정 실패: ${errorData.error}`);
      }
    } catch (error) {
      console.log("공지사항 수정 오류:", error);
      alert("공지사항 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    const confirmation = confirm("삭제하겠습니까?");
    if (confirmation) {
      try {
        const response = await fetch(
          `/api/user/appointments/${appointmentId}/information`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ noticeId }),
          }
        );
        if (response.ok) {
          alert("공지사항이 삭제되었습니다.");
          onNoticeDelete(noticeId); // 부모에게 삭제된 noticeId 전달
        } else {
          const errorData = await response.json();
          alert(`삭제 실패: ${errorData.error}`);
        }
      } catch (error) {
        console.log("공지사항 삭제 오류:", error);
        alert("공지사항 삭제 중 오류가 발생했습니다.");
      }
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
        {userId === ownerId ? (
          <div className={styles.icons}>
            <FaEdit className={styles.editIcon} onClick={openModal} />
            <FaTrash className={styles.trashIcon} onClick={handleDelete} />
          </div>
        ) : null}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.modalContainer}>
          <div className={styles.modalBox}>
            <span className={styles.modalTitle}>공지사항 수정하기</span>
            <textarea
              className={styles.modalContent}
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
            />
            <div className={styles.editButton}>
              <Button
                text="수정하기"
                size="sm"
                color="--primary-color"
                active={true}
                onClick={handleUpdate}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NoticeBox;

"use client";
import Button from "@/components/button/Button";
import styles from "./DeleteAccountModalContent.module.scss";
import { useRouter } from "next/navigation";

const DeleteAccountModalContent = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const handleConfirm = async () => {
    confirm("정말로 탈퇴하시겠습니까?");
    try {
      const response = await fetch("/api/user/delete-user", {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("탈퇴에 실패했습니다.");
      } else {
        alert("탈퇴가 완료되었습니다.");
        const { redirectUrl } = await response.json();

        if (redirectUrl) {
          router.push(redirectUrl);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("❌ 탈퇴 중 오류 발생:", error.message);
      }
      alert("탈퇴 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const handleCancel = () => {
    onClose();
  };
  return (
    <div className={styles.modalContent}>
      <p className={styles.question}>정말로 탈퇴하시겠습니까?</p>
      <p>
        지금까지 쌓아온 <span className={styles.highlight}>추억이 모두</span>
        사라지게 됩니다.
        <br />
        <span className={styles.highlight}>확인 버튼</span>을 클릭하시면 탈퇴가
        완료됩니다.
      </p>
      <p>그 동안 뭉치자를 이용해주셔서 감사합니다.</p>
      <div className={styles.buttonGroup}>
        <Button text="확인" size="xs" onClick={handleConfirm} />
        <Button
          text="취소"
          size="xs"
          color="--exit-red"
          onClick={handleCancel}
        />
      </div>
    </div>
  );
};

export default DeleteAccountModalContent;

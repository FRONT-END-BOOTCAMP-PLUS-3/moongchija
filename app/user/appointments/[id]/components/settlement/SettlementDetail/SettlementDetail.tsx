import { FC, useState } from "react";
import Button from "@/components/button/Button";
import styles from "./SettlementDetail.module.scss";
import Modal from "@/components/modal/Modal";
import SettlementModalContent from "../SettlementModalContent/SettlementModalContent";
import { SettlementDto } from "@/application/usecases/appointment/dto/SettlementDto";

interface SettlementDetailProps {
  settlementData: SettlementDto | null; // 정산이 없을 수도 있으므로 null 허용
}

const SettlementDetail: FC<SettlementDetailProps> = ({ settlementData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!settlementData) {
    return <p className={styles.noData}>정산 정보가 없습니다.</p>;
  }

  const handleCopy = () => {
    if (settlementData.accountNumber) {
      navigator.clipboard.writeText(settlementData.accountNumber).then(() => {
        alert("복사되었습니다");
      });
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleRegister = () => {
    alert("수정되었습니다");
    closeModal();
  };

  // 총액 계산
  const totalAmount = settlementData.details?.reduce(
    (sum, item) => sum + item.amount,
    0
  ) ?? 0;

  const perPersonAmount = settlementData.memberCount
    ? Math.floor(totalAmount / settlementData.memberCount)
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.title}>
          <span>정산 내역</span>
        </div>

        <div className={styles.settlementDetails}>
          {/* 표 1: 결제 항목 */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>내용</th>
                  <th>금액</th>
                </tr>
              </thead>
              <tbody>
                {settlementData.details?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.descript}</td>
                    <td>{item.amount.toLocaleString()}원</td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={2}>결제 항목이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.divider}></div>

          {/* 표 2: 정산 정보 */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td>총 액</td>
                  <td>{totalAmount.toLocaleString()}원</td>
                </tr>
                <tr>
                  <td>인원 수</td>
                  <td>{settlementData.memberCount || 0}명</td>
                </tr>
                <tr>
                  <td>인 당</td>
                  <td>{perPersonAmount.toLocaleString()}원</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 계좌 정보 */}
          <div className={styles.accountInfo}>
            <div className={styles.row}>
              <span>계좌번호</span>
              <div>
                <div className={styles.accountNumber}>
                  {settlementData.accountNumber || "없음"}
                </div>
                {settlementData.accountNumber && (
                  <button className={styles.copyButton} onClick={handleCopy}>
                    복사
                  </button>
                )}
              </div>
            </div>
            <div className={styles.row}>
              <span>은행사</span>
              <div>{settlementData.bank || "없음"}</div>
            </div>
            <div className={styles.row}>
              <span>예금주</span>
              <div>{settlementData.accountHolderName || "없음"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 수정하기 버튼 */}
      <div className={styles.editButton}>
        <Button
          text="수정하기"
          size="sm"
          color="--primary-color"
          active={true}
          onClick={openModal}
        />
      </div>

      {/* 정산 수정 모달 컴포넌트 */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <SettlementModalContent
          initialData={settlementData}
          handleRegister={handleRegister}
        />
      </Modal>
    </div>
  );
};

export default SettlementDetail;

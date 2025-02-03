import { FC, useState } from "react";
import Button from "@/components/button/Button";
import styles from "./SettlementDetail.module.scss";
import Modal from "@/components/modal/Modal";
import SettlementModalContent from "../SettlementModalContent/SettlementModalContent";
import { Settlement } from "../../detail/types/detailTypes";
import CircleButton from "@/components/circleButton/CircleButton";
import SettlementModalNew from "../SettlementModalNew/SettlementModalNew";

interface SettlementDetailProps {
  settlementData: Settlement | null; // 정산이 없을 수도 있으므로 null 허용
}

const SettlementDetail: FC<SettlementDetailProps> = ({ settlementData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const handleCopy = () => {
    if (settlementData) {
      navigator.clipboard.writeText(settlementData.accountNumber).then(() => {
        alert("복사되었습니다");
      });
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setIsNewModalOpen(true);
    console.log("open");
    console.log(isNewModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeNewModal = () => {
    setIsNewModalOpen(false);
  };

  const handleRegister = () => {
    alert("수정되었습니다");
    closeModal();
  };

  if (!settlementData) {
    return (
      <>
        <div className={styles.noSettlementContainer}>
          <div className={styles.noSettlement}>등록된 정산이 없습니다</div>

          <div className={styles.editButton}>
            <CircleButton onClick={openNewModal} />
          </div>
        </div>

        {/* 새로운 정산 작성 모달 컴포넌트 */}
        <Modal isOpen={isNewModalOpen} onClose={closeNewModal}>
          <SettlementModalNew handleRegister={handleRegister} />
        </Modal>
      </>
    );
  }

  // 총액 계산
  const totalAmount = settlementData.items.reduce(
    (sum, item) => sum + item.price,
    0
  );
  const perPersonAmount = Math.floor(
    totalAmount / settlementData.numberOfPeople
  );

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
                {settlementData.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.place}</td>
                    <td>{item.price.toLocaleString()}원</td>
                  </tr>
                ))}
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
                  <td>{settlementData.numberOfPeople}명</td>
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
                  {settlementData.accountNumber}
                </div>
                <button className={styles.copyButton} onClick={handleCopy}>
                  복사
                </button>
              </div>
            </div>
            <div className={styles.row}>
              <span>은행사</span>
              <div>{settlementData.bank}</div>
            </div>
            <div className={styles.row}>
              <span>예금주</span>
              <div>{settlementData.depositor}</div>
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

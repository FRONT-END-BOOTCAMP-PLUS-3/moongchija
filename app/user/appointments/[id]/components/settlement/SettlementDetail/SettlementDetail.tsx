"use client";

import { useState } from "react";
import Button from "@/components/button/Button";
import styles from "./SettlementDetail.module.scss";
import Modal from "@/components/modal/Modal";
import SettlementModalContent from "../SettlementModalContent/SettlementModalContent";

const SettlementDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("1122452-1234570").then(() => {
      alert("복사되었습니다");
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRegister = () => {
    alert("수정되었습니다");
    closeModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.title}>
          <span>정산 내역</span>
        </div>

        <div className={styles.settlementDetails}>
          {/* 표 1 */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>내용</th>
                  <th>금액</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>고깃집</td>
                  <td>20,000원</td>
                </tr>
                <tr>
                  <td>카페</td>
                  <td>20,000원</td>
                </tr>
                <tr>
                  <td>떡볶이집</td>
                  <td>30,000원</td>
                </tr>
                <tr>
                  <td>방탈출</td>
                  <td>30,000원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.divider}></div>

          {/* 표 2 */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td>총 액</td>
                  <td>100,000원</td>
                </tr>
                <tr>
                  <td>인원 수</td>
                  <td>4명</td>
                </tr>
                <tr>
                  <td>인 당</td>
                  <td>25,000원</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 계좌 정보 */}
          <div className={styles.accountInfo}>
            <div className={styles.row}>
              <span>계좌번호</span>
              <div>
                123456789123456
                <button className={styles.copyButton} onClick={handleCopy}>
                  복사
                </button>
              </div>
            </div>
            <div className={styles.row}>
              <span>은행사</span>
              <div>국민은행</div>
            </div>
            <div className={styles.row}>
              <span>예금주</span>
              <div>고뭉치</div>
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

      {/* 모달 컴포넌트 */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <SettlementModalContent handleRegister={handleRegister} />
      </Modal>
    </div>
  );
};

export default SettlementDetail;

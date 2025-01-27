"use client";

import { useState } from "react";
import Button from "@/components/button/Button";
import styles from "./SettlementDetail.module.scss";
import Modal from "@/components/modal/Modal";
import { FaPlus } from "react-icons/fa6";

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
                  <td>20,000</td>
                </tr>
                <tr>
                  <td>카페</td>
                  <td>20,000</td>
                </tr>
                <tr>
                  <td>떡볶이집</td>
                  <td>30,000</td>
                </tr>
                <tr>
                  <td>방탈출</td>
                  <td>30,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 표 2 */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td>총 액 (원)</td>
                  <td>100,000</td>
                </tr>
                <tr>
                  <td>인원 수 (명)</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>인 당 (원)</td>
                  <td>25,000</td>
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
        <div className={styles.modalContainer}>
          <div className={styles.modalWrapper}>
            <span className={styles.modalTitle}>정산 내역</span>
            <div className={styles.modalBox}>
              {/* 내역 목록 */}

              <div className={styles.modalListContainer}>
                <div className={styles.modalListWrapper}>
                  <div className={styles.modalListBox}>
                    <input
                      className={styles.place}
                      type="text"
                      value="고깃집"
                      readOnly
                    />
                    <input
                      className={styles.price}
                      type="number"
                      value="100000"
                      readOnly
                    />
                    원
                  </div>

                  <button className={styles.inputPlusButton}>
                    <FaPlus className={styles.icon} />
                  </button>
                </div>

                {/* 결과 */}
                <div className={styles.modalResultBox}>
                  <div className={styles.totalPrice}>
                    <span>총 액</span>
                    <div className={styles.currency}>
                      <input type="number" value="100000" readOnly />
                      <span>원</span>
                    </div>
                  </div>

                  <div className={styles.totalNumber}>
                    <span>인원 수</span>

                    <div className={styles.numberInput}>
                      <span className={styles.divide}>÷</span>
                      <input type="number" value="4" readOnly />
                      <span>명</span>
                    </div>
                  </div>

                  <div className={styles.dividedPrice}>
                    <span>인 당</span>
                    <div className={styles.priceInput}>
                      <input type="number" value="25000" readOnly />
                      <span>원</span>
                    </div>
                  </div>
                </div>
              </div>

              <span className={styles.modalAccountTitle}>정산 계좌 정보</span>
              <div className={styles.modalAccountBox}>
                <div className={styles.account}>
                  <span>계좌 번호</span>
                  <input type="text" value="123456789123456" readOnly />
                </div>
                <div className={styles.bank}>
                  <span>은행사</span>
                  <input type="text" value="국민은행" readOnly />
                </div>
                <div className={styles.depositor}>
                  <span>예금주</span>
                  <input type="text" value="김코난" readOnly />
                </div>
              </div>
            </div>
          </div>
          {/* 모달 내 수정하기 버튼 */}
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
      </Modal>
    </div>
  );
};

export default SettlementDetail;

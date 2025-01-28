"use client";

import { FaPlus } from "react-icons/fa6";
import Button from "@/components/button/Button";
import styles from "./../SettlementDetail/SettlementDetail.module.scss";
type ModalContentProps = {
  handleRegister: () => void;
};

const SettlementModalContent = ({ handleRegister }: ModalContentProps) => {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalWrapper}>
        <span className={styles.modalTitle}>정산 내역</span>
        <div className={styles.modalBox}>
          {/* 내역 목록 */}
          <div className={styles.modalListContainer}>
            <div className={styles.modalListWrapper}>
              <div className={styles.modalListBox}>
                <input className={styles.place} type="text" value="고깃집" readOnly />
                <input className={styles.price} type="number" value="100000" readOnly />
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
                  <span>100,000원</span>
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
                <span>25,000원</span>
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
  );
};

export default SettlementModalContent;

"use client";

import Button from "@/components/button/Button";
import styles from "./SettlementDetail.module.scss";

const SettlementDetail = () => {
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
                1122452-1234570
                <button className={styles.copyButton}>복사</button>
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
            />
          </div>
    </div>
  );
};

export default SettlementDetail;

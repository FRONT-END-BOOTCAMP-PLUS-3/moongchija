import Button from "@/components/button/Button";
import styles from "./voteResult.module.scss";
import TimeResult from "./components/TimeResult";
import ArrowHeader from "@/components/header/ArrowHeader";

const VoteResultPage = () => {
  return (
    <div className={styles.voteResultContainer}>
      <p className={styles.subtitle}>
        현재까지 <span style={{ color: "red" }}>n</span> 명의 시간 조율 결과예요
      </p>
      <div className={styles.wrapTapButton}>
        <div className={styles.tapButton}>
          <button className={styles.timeButton} disabled={false}>
            시간
          </button>
          <button className={styles.placeButton} disabled={true}>
            장소
          </button>
        </div>
      </div>
      <TimeResult />
      <div className={styles.wrapButton}>
        <Button text="약속 확정하러 가기" size="lg" />
      </div>
    </div>
  );
};

export default VoteResultPage;

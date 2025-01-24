import InformationDetail from "../components/detail/InformationDetail/InformationDetail";
import NoticeDetail from "../components/detail/NoticeDetail/NoticeDetail";
import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
import Button from "@/components/button/Button";
import styles from "./information.module.scss";

const InformationPage = () => {
  return (
    <div>
      <DetailTabMenu />
      <div className={styles.container}>
        <InformationDetail />
        <NoticeDetail />

        <div className={styles.buttonWrapper}>
          <div className={styles.copyButton}>
            <Button
              text="방 번호 복사"
              size="sm"
              color="--primary-color"
              active={true}
            />
          </div>
          <div className={styles.redButtonWrapper}>
            <div className={styles.deleteButton}>
              <Button
                text="삭제하기"
                size="sm"
                color="--exit-red"
                active={true}
              />
            </div>
            <div className={styles.exitButton}>
              <Button
                text="나가기"
                size="sm"
                color="--exit-red"
                active={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationPage;

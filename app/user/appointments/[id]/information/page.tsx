import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
import Button from "@/components/button/Button";
import styles from "./information.module.scss";
import InformationDetail from "../components/information/InformationDetail/InformationDetail";
import NoticeDetail from "../components/information/NoticeDetail/NoticeDetail";

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

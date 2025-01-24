import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
import SettlementDetail from "../components/settlement/SettlementDetail/SettlementDetail";
import styles from "./settlement.module.scss";

const SettlementPage = () => {
  return (
    <div>
      <DetailTabMenu />
      <div className={styles.container}>
        <SettlementDetail />
      </div>
    </div>
  );
};

export default SettlementPage;

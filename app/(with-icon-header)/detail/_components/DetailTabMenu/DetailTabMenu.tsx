import styles from "./DetailTabMenu.module.scss";

const TabMenu = () => {
  return(
  <div className={styles.container}>
    
    <div className={styles.information}>
      <button>약속 정보</button>
    </div>

    <div className={styles.settlement}>
      <button>정산 하기</button>
    </div>

    <div className={styles.gallery}>
      <button>추억 공간</button>
    </div>

  </div>
  )
};

export default TabMenu;

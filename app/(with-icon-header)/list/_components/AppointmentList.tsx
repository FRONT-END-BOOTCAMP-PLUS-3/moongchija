"use client"

import styles from "./AppointmentList.module.scss"
import ListBox from "./listBox";

const AppointmentList: React.FC = () => {

  return (
    <div className={styles.container}>
        <ListBox />
    </div>
  );
};

export default AppointmentList;

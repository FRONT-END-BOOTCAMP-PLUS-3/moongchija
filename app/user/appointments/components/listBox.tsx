"use client"

import styles from "./listBox.module.scss"
import { FaPeopleGroup } from "react-icons/fa6";
import { IoMdPin } from "react-icons/io";
// import crown from "@/public/images/icons/crown.webp"

const ListBox: React.FC = () => {

  return (
    <div className={styles.container}>
        <section className={styles.leftBox}>
            <div className={styles.titleWrapper}>
                <FaPeopleGroup size={25}/>
                <span>{'저녁에 치맥'}</span>
            </div>
            <div className={styles.dateWrapper}>
                <p>{'2025.01.17(금) 18:00 ~'}</p>
                <p>{'2025.01.20(월)'}</p>
            </div>
            <div className={styles.participantWrapper}>
                <span className={styles.participants}>😀😀😀😀😀</span>
                <span className={styles.extraParticipants}>외 {'1'}명</span>
            </div>
        </section>
        <section className={styles.RightBox}>
            <div className={styles.countdown}>
                {'D-1'}
            </div>
            <div className={styles.locationWrapper}>
                <IoMdPin size={30} color="red" />
                <span>{'홍대입구역'}</span>
            </div>
        </section>
    </div>
  );
};

export default ListBox;

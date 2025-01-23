import InputPlusButton from "@/components/input-plus-button/InputPlusButton";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1 className={styles.h1}>초기화면페이지</h1>
      <InputPlusButton/>
    </div>
  );
}

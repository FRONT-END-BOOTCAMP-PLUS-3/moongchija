import Button from "@/components/button/Button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1 className={styles.h1}>초기화면페이지</h1>
      <Button text="xs" size="xs" color="--primary-color" active={true} />
      <Button text="sm" size="sm" color="--primary-color" active={true} />

      <Button text="md" size="md" color="--primary-color" active={true} />
      <Button text="lg" size="lg" color="--primary-color" active={true} />
    </div>
  );
}

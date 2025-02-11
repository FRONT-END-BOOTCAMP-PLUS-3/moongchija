import styles from "./page.module.scss";
import Button from "@/components/button/Button";
import Link from "next/link";
import Moongchi from "@/components/moongchi/Moongchi";

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.topBox}>
        <Moongchi />
        <span className={styles.subTitle}>모임 약속 정할 땐!</span>
        <h1 className={styles.title}>뭉치자</h1>
      </div>

      <div className={styles.bottomBox}>
        <Link href="/login">
          <Button text="로그인" size="lg" />
        </Link>
      </div>
    </div>
  );
};
export default Home;

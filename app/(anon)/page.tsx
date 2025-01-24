import Image from "next/image";
import styles from "./page.module.scss";
import Button from "@/components/button/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.topBox}>
        <Image
          src={"/images/logos/main-logo.svg"}
          alt="메인 로고"
          width={209}
          height={209}
        />
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
}

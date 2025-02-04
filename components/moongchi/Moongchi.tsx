"use client";

import { motion } from "framer-motion";
import styles from "./Moongchi.module.scss";

// 흰색 원 위치 (더 자연스럽게 퍼지도록 수정)
const petalPositions = [
  { x: -20, y: -25 },
  { x: 20, y: -25 },
  { x: -35, y: 0 },
  { x: 35, y: 0 },
  { x: -20, y: 25 },
  { x: 20, y: 25 },
];

const petalVariants = {
  hidden: (index: number) => ({
    x: petalPositions[index].x * 5, // 더 멀리 퍼짐
    y: petalPositions[index].y * 5,
    scale: 0,
    opacity: 0,
  }),
  visible: (index: number) => ({
    x: petalPositions[index].x, // 부드럽게 중앙으로 모임
    y: petalPositions[index].y,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: index * 0.1,
    },
  }),
};

const faceVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.8, duration: 0.5, ease: "easeOut" },
  },
};

const Moongchi = () => {
  return (
    <motion.div
      className={styles.mungchiContainer}
      initial="hidden"
      animate="visible"
    >
      {/* 원 (6개) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={styles.petal}
          variants={petalVariants}
          custom={i}
        />
      ))}

      {/* 얼굴 (눈 + 입) */}
      <motion.div className={styles.face} variants={faceVariants}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div className={styles.eye}>
            <div className={styles.eyeHighlightBig}></div>
            <div className={styles.eyeHighlightSmall}></div>
          </div>
          <div className={styles.eye}>
            <div className={styles.eyeHighlightBig}></div>
            <div className={styles.eyeHighlightSmall}></div>
          </div>
        </div>
        <div className={styles.mouth}></div>
      </motion.div>
    </motion.div>
  );
};

export default Moongchi;

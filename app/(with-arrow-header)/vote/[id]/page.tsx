"use client";

import styles from "./vote.module.scss";
import TimeVotePage from "./_components/TimeVote";

const VotePage = () => {
  return (
    <div className={styles.voteContainer}>
      <TimeVotePage />
    </div>
  );
};

export default VotePage;

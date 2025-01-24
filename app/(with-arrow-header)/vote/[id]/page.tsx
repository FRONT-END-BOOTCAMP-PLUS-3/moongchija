"use client";

import styles from "./vote.module.scss";
import TimeVotePage from "./_components/TimeVote";
import PlaceVote from "./_components/PlaceVote";

const VotePage = () => {
  return (
    <div className={styles.voteContainer}>
      {/* <TimeVotePage /> */}
      <PlaceVote />
    </div>
  );
};

export default VotePage;

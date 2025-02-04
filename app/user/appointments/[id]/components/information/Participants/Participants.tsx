import styles from "./Participants.module.scss";

interface ParticipantsProps {
  participant: {
    nickname: string;
    emoji: string;
  };
}

const Participants = ({ participant }: ParticipantsProps) => {
  return (
    <div className={styles.participants}>
      <div>{participant.emoji}</div>
      <span>{participant.nickname}</span>
    </div>
  );
};

export default Participants;

import Image from "next/image";
import styles from "./Participants.module.scss";

interface ParticipantsProps {
  participant: {
    nickname: string;
    emoji: string;
  };
}

const Participants = ({ participant }: ParticipantsProps) => {
 
 console.log(participant);
 
  return (
    <div className={styles.participants}>
      <Image
        src={participant.emoji}
        alt={`Participant`}
        width={20}
        height={20}
      />

      <span>{participant.nickname}</span>
    </div>
  );
};

export default Participants;

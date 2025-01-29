import styles from "./Participants.module.scss";
import { FaSmile } from "react-icons/fa";

interface ParticipantsProps {
  name: string;
}

const Participants = ({ name }: ParticipantsProps) => {
  return (
    <div className={styles.participants}>
      <FaSmile />
      <span>{name}</span>
    </div>
  );
};

export default Participants;

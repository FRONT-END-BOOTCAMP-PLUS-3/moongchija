import styles from "./Participants.module.scss";
import { FaSmile } from "react-icons/fa";

const Participants = () => {
  return (
    <div className={styles.participants}>
      <FaSmile />
      <span>고뭉치</span>
    </div>
  );
};

export default Participants;

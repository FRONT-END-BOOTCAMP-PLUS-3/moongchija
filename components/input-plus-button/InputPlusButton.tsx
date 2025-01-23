import { FaPlus } from "react-icons/fa";
import styles from "./InputPlusButton.module.scss";

const InputPlusButton = () => {
  return (
    <button className={styles.inputPlusButton}>
      <FaPlus className={styles.icon} />
    </button>
  );
};

export default InputPlusButton;

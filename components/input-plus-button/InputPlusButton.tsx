import { FaPlus } from "react-icons/fa";
import styles from "./InputPlusButton.module.scss";

type InputPlusButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const InputPlusButton: React.FC<InputPlusButtonProps> = ({ onClick }) => {
  return (
    <button className={styles.inputPlusButton} onClick={onClick}>
      <FaPlus className={styles.icon} />
    </button>
  );
};

export default InputPlusButton;

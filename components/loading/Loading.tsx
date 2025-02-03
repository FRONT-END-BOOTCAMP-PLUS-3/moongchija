import { ClipLoader } from 'react-spinners';
import styles from "./Loading.module.scss";

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <ClipLoader size={60} color="#9CC0FF" />
    </div>
  );
};

export default Loading;

import Image from "next/image";
import styles from "./Modal.module.scss";
import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";

// const [isModalOpen, setIsModalOpen] = useState(false);

// const openModal = () => setIsModalOpen(true);
// const closeModal = () => setIsModalOpen(false);

interface Modal {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: Modal) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className={styles.modalContainer} onClick={onClose}>
      <div className={styles.modalWrapper} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalBox}>
          <Image
            src={"/images/logos/sub-logo.webp"}
            alt="sub-logo"
            width={30}
            height={30}
          />
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <IoIosClose size={40} />
          </button>
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

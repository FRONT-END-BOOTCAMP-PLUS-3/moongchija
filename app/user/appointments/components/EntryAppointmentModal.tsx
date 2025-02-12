import styles from "./EntryAppointmentModal.module.scss";
import Button from "@/components/button/Button";
import InputField from "@/components/input-filed/InputFiled";
import useEntryAppointmentModal from "../hooks/useEntryAppointmentModal";

const EntryAppointmentModal: React.FC = () => {
  const {
    hooks: { appointmentId, error },
    handlers: { handleRoomNumberChange, fetchCheckAppointmentEntry },
  } = useEntryAppointmentModal();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 제출 방지
    fetchCheckAppointmentEntry();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.roomEntryBox}>
      <InputField
        label="방 번호"
        value={appointmentId}
        onChange={handleRoomNumberChange}
        type="text"
        error={error}
      />
      <Button size="sm" text="참여" />
    </form>
  );
};

export default EntryAppointmentModal;

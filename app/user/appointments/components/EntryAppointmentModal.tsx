import styles from "./EntryAppointmentModal.module.scss";
import Button from "@/components/button/Button";
import InputField from "@/components/input-filed/InputFiled";
import useEnrtyAppointmentModal from "../hooks/useEnrtyAppointmentModal";

const EntryAppointmentModal: React.FC = () => {
  const {
    hooks: {
      appointmentId,
      error,
    },
    handlers: {
      handleRoomNumberChange,
      fetchCheckAppointmentEntry,
    },
  } = useEnrtyAppointmentModal();

  return (
    <div className={styles.roomEntryBox}>
      <InputField
        label="방 번호"
        value={appointmentId}
        onChange={handleRoomNumberChange}
        type="text"
        error={error}
      />
      <Button size="sm" text="참여" onClick={fetchCheckAppointmentEntry} />
    </div>
  );
};

export default EntryAppointmentModal;

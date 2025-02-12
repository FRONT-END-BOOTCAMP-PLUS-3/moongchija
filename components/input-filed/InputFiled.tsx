import React from "react";
import styles from "./InputField.module.scss";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string | null; // 유효성 검사 실패 시 표시할 오류 메시지
  success?: string | null;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error,
  success,
  disabled = false,
}) => (
  <div className={`${styles.inputField} ${error ? styles.errorField : ""}`}>
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
    {error && <p className={styles.errorMessage}>{error}</p>}
    {success && <p className={styles.successMessage}>{success}</p>}
  </div>
);

export default InputField;

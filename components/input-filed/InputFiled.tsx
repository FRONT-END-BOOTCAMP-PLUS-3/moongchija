import React from "react";
import styles from "./InputField.module.scss";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string; // 유효성 검사 실패 시 표시할 오류 메시지
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error,
}) => (
  <div
    className={`${styles.inputField} ${error ? styles.errorField : ""}`}
  >
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && <p className={styles.errorMessage}>{error}</p>}
  </div>
);

export default InputField;

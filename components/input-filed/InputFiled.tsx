import React from "react";
import styles from "./InputField.module.scss";

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) => (
  <div className={styles.inputField}>
    <label>{label}: </label>
    <input type={type} value={value} onChange={onChange} />
  </div>
);

export default InputField;

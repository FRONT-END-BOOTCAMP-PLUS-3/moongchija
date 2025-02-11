import { useState } from "react";
import styles from "./EmailInputField.module.scss";
import InputField from "@/components/input-filed/InputFiled";
import useInput from "../hooks/useInput";
import { EMAIL_DOMAINS } from "../constants/EMAIL_DOMAINS";

interface EmailInputFieldProps {
  label: string;
  onChange: (email: string) => void;
  error?: string | null;
}

const EmailInputField = ({ label, onChange, error }: EmailInputFieldProps) => {
  const { value: localEmail, setValue: setLocalEmail } = useInput("");
  const [domain, setDomain] = useState("gmail.com");
  // const domain = "moongchi.com";

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalEmail(e.target.value);
    onChange(`${e.target.value}@${domain}`);
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDomain = e.target.value;
    setDomain(selectedDomain);
    onChange(`${localEmail}@${selectedDomain}`);
  };

  return (
    <div className={styles.emailInputContainer}>
      <div className={styles.inputField}>
        <InputField
          label={label}
          type="text"
          value={localEmail}
          onChange={handleEmailChange}
          placeholder="이메일 아이디"
          error={error}
        />
      </div>
      <span className={styles.atSymbol}>@</span>
      <select
        value={domain}
        onChange={handleDomainChange}
        className={styles.domainSelect}
      >
        {EMAIL_DOMAINS.map((dom) => (
          <option key={dom} value={dom}>
            {dom}
          </option>
        ))}
      </select>

      {/* <label className={styles.domainLabel}>도메인</label>
      <input type="text" value={domain} disabled className={styles.domain} /> */}
    </div>
  );
};

export default EmailInputField;

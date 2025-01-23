import styles from "./button.module.scss";

const Button = ({
  text,
  size,
  color,
  active,
}: {
  text: string;
  size: "xs" | "sm" | "md" | "lg";
  color: "--primary-color" | "--exit-red";
  active: boolean;
}) => {
  return (
    <div className={styles.buttonWrapper}>
      <button
        className={styles[`${size}Button`]}
        style={{ backgroundColor: `var(${color})` }}
        disabled={!active}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;

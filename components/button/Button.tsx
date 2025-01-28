import styles from "./Button.module.scss";

const Button = ({
  text,
  size,
  color = "--primary-color",
  active = true,
  onClick,
}: {
  text: string;
  size: "xs" | "sm" | "md" | "lg";
  color?: "--primary-color" | "--exit-red";
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <div className={styles.buttonWrapper}>
      <button
        className={styles[`${size}Button`]}
        style={{ backgroundColor: `var(${color})` }}
        disabled={!active}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;

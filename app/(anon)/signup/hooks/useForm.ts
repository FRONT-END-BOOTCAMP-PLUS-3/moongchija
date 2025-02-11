import useInput from "./useInput";
import {
  validateEmail,
  validateNickname,
  validatePassword,
  validatePasswordCheck,
} from "./useValidate";

const useForm = () => {
  const {
    value: email,
    setValue: setEmail,
    error: emailError,
    onChange: handleChangeEmail,
  } = useInput("", validateEmail);
  const {
    value: nickname,
    setValue: setNickname,
    error: nicknameError,
    onChange: handleChangeNickname,
  } = useInput("", validateNickname);
  const {
    value: password,
    setValue: setPassword,
    error: passwordError,
    onChange: handleChangePassword,
  } = useInput("", validatePassword);

  const {
    value: passwordCheck,
    setValue: setPasswordCheck,
    error: passwordCheckError,
    onChange: habdleChangePasswordCheck,
  } = useInput(
    "",
    (passwordCheck) => validatePasswordCheck(passwordCheck, password),
    password
  );

  const isFormValid = [
    emailError,
    nicknameError,
    passwordError,
    passwordCheckError,
    !email,
    !nickname,
    !password,
    !passwordCheck,
  ].every((error) => !error);

  return {
    email: { email, setEmail, emailError, handleChangeEmail },
    nickname: {
      nickname,
      setNickname,
      nicknameError,
      handleChangeNickname,
    },
    password: {
      password,
      setPassword,
      passwordError,
      handleChangePassword,
    },
    passwordCheck: {
      passwordCheck,
      setPasswordCheck,
      passwordCheckError,
      habdleChangePasswordCheck,
    },
    isFormValid,
  };
};

export default useForm;

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
    error: emailError,
    onChange: handleChangeEmail,
  } = useInput("", validateEmail);
  const {
    value: nickname,
    error: nicknameError,
    onChange: habdleChangeNickname,
  } = useInput("", validateNickname);
  const {
    value: password,
    error: passwordError,
    onChange: habdleChangePassword,
  } = useInput("", validatePassword);

  const {
    value: passwordCheck,
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
    email: { email, emailError, handleChangeEmail },
    nickname: {
      nickname,
      nicknameError,
      habdleChangeNickname,
    },
    password: {
      password,
      passwordError,
      habdleChangePassword,
    },
    passwordCheck: {
      passwordCheck,
      passwordCheckError,
      habdleChangePasswordCheck,
    },
    isFormValid,
  };
};

export default useForm;

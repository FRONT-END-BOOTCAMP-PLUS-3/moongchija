export const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "유효하지 않은 이메일 형식입니다.";
  }
  return null;
};

export const validateNickname = (value: string) => {
  const nicknameRegex = /^[a-z0-9가-힣]{1,10}$/;
  if (!nicknameRegex.test(value)) {
    return "소문자, 한글, 숫자를 포함하여 10자 이하로 작성해주세요.";
  }
  return null;
};

export const validatePassword = (value: string) => {
  const passwordRegex = /^[a-z\d]{8,}$/;
  if (!passwordRegex.test(value)) {
    return "비밀번호는 소문자와 숫자로만 구성된 8자리 이상이어야 합니다.";
  }
  return null;
};

export const validatePasswordCheck = (
  password: string,
  passwordCheck: string
) => {
  if (password !== passwordCheck) {
    return "비밀번호가 일치하지 않습니다.";
  }
  return null;
};

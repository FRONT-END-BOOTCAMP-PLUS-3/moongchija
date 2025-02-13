import { useEffect, useState } from "react";
import { useCreateAppointment } from "@/context/CreateAppointmentContext";

const quizList = [
  "방장의 MBTI는?",
  "방장이 평소에 싫다고 하는 사람은?",
  "방장이 어제 저녁에 먹은 음식은?",
  "방장이 직전에 쓰던 핸드폰은?",
  "방장의 주민번호 앞자리는?",
  "방장이 사형수라면 마지막 식사는 뭘까?",
  "방장이 좋아하는 색깔은?",
  "방장이 갑자기 슈퍼 히어로가 된다면 내 초능력은 뭐일까?",
  "방장의 첫사랑 이름은?",
  "방장이 좋아하는 동물은?",
  "직접 입력하기",
];

const useCreateInformation = (onPageChange: (index: number) => void) => {
  const { appointment, setAppointment } = useCreateAppointment();

  const [isCustomQuiz, setIsCustomQuiz] = useState<boolean>(false); 
  const [nameError, setNameError] = useState<string>("");
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  // 퀴즈 선택 변경
  const handleQuizChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setIsCustomQuiz(selectedValue === "직접 입력하기");

    setAppointment((prev) => ({
      ...prev,
      quiz: selectedValue === "직접 입력하기" ? "" : selectedValue,
    }));
  };

  // 약속 이름 입력
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameError(
      value.length > 20 ? "약속 이름은 최대 20자까지 입력 가능합니다." : ""
    );
    setAppointment((prev) => ({ ...prev, title: value }));
  };

  // 퀴즈 내용을 직접 입력
  const handleSetQuiz = (quiz: string) => {
    setAppointment((prev) => ({ ...prev, quiz })); 
  };

  // 답변 내용을 설정
  const handleSetAnswer = (answer: string) => {
    setAppointment((prev) => ({ ...prev, answer }));
  };

  // '다음' 버튼 클릭
  const handleNextButton = () => {
    onPageChange(2);
  };

  // '다음' 버튼 활성화 여부
  useEffect(() => {
    setIsButtonActive(
      appointment.title.trim().length > 0 &&
        nameError === "" &&
        appointment.quiz!.trim().length > 0 &&
        appointment.answer!.trim().length > 0
    );
  }, [appointment.title, appointment.quiz, appointment.answer, nameError]);

  return {
    quizList,
    hooks: {
      appointment,
      isCustomQuiz,
      nameError,
      isButtonActive,
    },
    handlers: {
      handleQuizChange,
      handleNameChange,
      handleSetQuiz,
      handleSetAnswer,
      handleNextButton,
    },
  };
};

export default useCreateInformation;

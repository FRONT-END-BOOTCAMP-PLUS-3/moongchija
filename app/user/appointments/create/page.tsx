"use client";

import styles from "./create.module.scss";
import Button from "@/components/button/Button";
import InputField from "@/components/input-filed/InputFiled";
import { useState, useEffect } from "react";
import CircleIndicator from "./components/CircleIndicator";

const quizList = [
  "내 MBTI는?",
  "내가 평소에 싫다고 하는 사람은?",
  "내가 어제 저녁에 먹은 음식은?",
  "내가 직전에 쓰던 핸드폰은?",
  "너의 이름은?",
  "내가 사형수라면 마지막 식사는 뭘까?",
  "햄최몇?",
  "내가 갑자기 슈퍼 히어로가 된다면 내 초능력은 뭐일까?",
  "너의 신발 사이즈는?",
  "내가 좋아하는 동물은?",
  "직접 입력하기",
];

const CreatePage = () => {
  const [name, setName] = useState<string>("");
  const [quiz, setQuiz] = useState<string>("내 MBTI는?");
  const [answer, setAnswer] = useState<string>("");
  const [isCustomQuiz, setIsCustomQuiz] = useState<boolean>(false);

  const [nameError, setNameError] = useState<string>("");
  const [quizError, setQuizError] = useState<string>("");
  const [answerError, setAnswerError] = useState<string>("");
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const handleQuizChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setQuiz(selectedValue);
    setIsCustomQuiz(selectedValue === "직접 입력하기");

    if (selectedValue !== "직접 입력하기") {
      setQuiz(selectedValue);
    } else {
      setQuiz("");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 20) {
      setNameError("약속 이름은 최대 20자까지 입력 가능합니다.");
    } else {
      setNameError("");
    }
    setName(value);
  };

  const handleNextButton = () => {
    console.log("다음");
  };

  useEffect(() => {
    // 모든 필드가 유효한지 확인하여 버튼 활성화 상태 설정
    const isFormValid =
      name.trim().length > 0 &&
      nameError === "" &&
      quiz.trim().length > 0 &&
      answer.trim().length > 0;
    setIsButtonActive(isFormValid);
  }, [name, quiz, answer, nameError]);

  return (
    <div className={styles.container}>
      <section className={styles.mainBox}>
        <div className={styles.indicatorWrapper}>
          <CircleIndicator total={3} activeIndexs={[0]} />
        </div>

        <InputField
          label="약속 이름"
          placeholder="약속 이름을 입력하세요. (최대 20자)"
          value={name}
          onChange={handleNameChange}
          error={nameError}
        />

        <label htmlFor="quiz-select">비밀번호 퀴즈</label>
        <select
          id="quiz-select"
          value={isCustomQuiz ? "직접 입력하기" : quiz}
          onChange={handleQuizChange}
        >
          {quizList.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {isCustomQuiz && (
          <input
            type="text"
            value={quiz}
            onChange={(e) => setQuiz(e.target.value)}
            placeholder="퀴즈를 입력하세요."
          />
        )}

        {quizError && <p className={styles.errorMessage}>{quizError}</p>}

        <InputField
          label="비밀번호 퀴즈 답"
          placeholder="퀴즈 답을 입력하세요."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          error={answerError}
        />
      </section>

      <Button
        size="lg"
        text="다음"
        active={isButtonActive}
        onClick={handleNextButton}
      />
    </div>
  );
};

export default CreatePage;
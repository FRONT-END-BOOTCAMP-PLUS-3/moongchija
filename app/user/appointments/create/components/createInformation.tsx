"use client";

import styles from "./createInformation.module.scss";
import Button from "@/components/button/Button";
import InputField from "@/components/input-filed/InputFiled";
import useCreateInformation from "../hooks/useCreateInformaion";
import CircleIndicator from "./CircleIndicator";

interface Props {
  onPageChange: (index: number) => void;
}

const CreateInformation: React.FC<Props> = ({ onPageChange }) => {
  const {
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
  } = useCreateInformation(onPageChange);

  return (
    <div className={styles.container}>
      <section className={styles.mainBox}>
        <div className={styles.indicatorWrapper}>
          <CircleIndicator total={3} activeIndexs={[0]} />
        </div>

        <InputField
          label="약속 이름"
          placeholder="약속 이름을 입력하세요. (최대 20자)"
          value={appointment.title}
          onChange={handleNameChange}
          error={nameError}
        />

        <label htmlFor="quiz-select">비밀번호 퀴즈</label>
        <select
          id="quiz-select"
          value={isCustomQuiz ? "직접 입력하기" : appointment.quiz!}
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
            value={appointment.quiz!}
            onChange={(e) => handleSetQuiz(e.target.value)}
            placeholder="퀴즈를 입력하세요."
          />
        )}

        <InputField
          label="비밀번호 퀴즈 답"
          placeholder="퀴즈 답을 입력하세요."
          value={appointment.answer!}
          onChange={(e) => handleSetAnswer(e.target.value)}
        />
      </section>

      <div className={styles.buttonWrapper}>
        <Button
          size="lg"
          text="다음"
          active={isButtonActive}
          onClick={handleNextButton}
        />
      </div>
    </div>
  );
};

export default CreateInformation;

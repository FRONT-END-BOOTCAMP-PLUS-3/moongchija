"use client";

import styles from "./entry.module.scss";
import useEntry from "./hooks/useEntry";
import Button from "@/components/button/Button";
import IconHeader from "@/components/header/IconHeader";
import InputField from "@/components/input-filed/InputFiled";
import Loading from "@/components/loading/Loading";
import Moongchi from "@/components/moongchi/Moongchi";

const EntryPage = () => {
  const {
    hooks: {
      loadingAppointment,
      loadingEntry,
      appointment,
      answer,
      error,
      answerActive,
    },
    handlers: { handleAnswerChange, fetchEntryMember },
  } = useEntry();

  return (
    <>
      <IconHeader />
      <div className={styles.completeContainer}>
        {loadingAppointment ? (
          <Loading />
        ) : (
          <form onSubmit={fetchEntryMember}>
            <Moongchi />
            <h2 className={styles.title}>퀴즈를 맞혀보세요!</h2>

            <section className={styles.informationBox}>
              <div className={styles.infoRow}>
                <span className={styles.label}>약속 이름</span>
                <span className={styles.labelValue}>{appointment?.title}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>퀴즈</span>
                <span className={styles.labelValue}>{appointment?.quiz}</span>
              </div>

              <div className={styles.inputBox}>
                <InputField
                  label="퀴즈 답"
                  value={answer}
                  placeholder="퀴즈 답을 입력하세요."
                  onChange={handleAnswerChange}
                  error={error}
                  disabled={loadingEntry}
                />
              </div>
            </section>

            <section className={styles.buttonBox}>
              <Button
                text="참여"
                size="lg"
                active={answerActive && !loadingEntry}
              />
            </section>
          </form>
        )}

        {loadingEntry && (
          <section className={styles.loadingBox}>
            <Loading />
          </section>
        )}
      </div>
    </>
  );
};

export default EntryPage;

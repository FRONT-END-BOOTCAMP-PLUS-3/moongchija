"use client";

import Image from "next/image";
import Calendar from "./_components/Calendar";
import styles from "./mypage.module.scss";
import Button from "@/components/button/Button";
import AppointmentCount from "./_components/AppointmentCount";
import { useState } from "react";
import useInput from "@/app/signup/_hooks/useInput";

const appointmentData = [
  { color: "greenColor", text: "투표중" },
  { color: "orangeColor", text: "예정" },
  { color: "pinkColor", text: "확정" },
];

const MyPagePage = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { value: nickname, onChange: handleChangeInput } = useInput("");

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.profileBox}>
          <div className={styles.profileImage}>
            <Image
              src={"/images/emojis/cerberus.webp"}
              width={100}
              height={100}
              alt="케르베로스"
            />
          </div>
          <Button text="수정" size="xs" />
        </div>
        <div className={styles.userNameBox}>
          <div className={styles.editingBox}>
            {isEditing ? (
              <>
                <label htmlFor="nickname" className={styles.hiddenLabel}>
                  닉네임
                </label>
                <input
                  type="text"
                  id="nickname"
                  value={nickname}
                  onChange={handleChangeInput}
                  placeholder="닉네임을 입력해 주세요."
                  className={styles.userNameInput}
                />
              </>
            ) : (
              <div className={styles.userName}>
                <h1>뭉치짱</h1>
              </div>
            )}

            <div onClick={handleEditClick} className={styles.editButtonBox}>
              <Button text="수정" size="xs" />
            </div>
          </div>
          <div>
            <div className={styles.appointmentCountBox}>
              {appointmentData.map((item, index) => (
                <AppointmentCount
                  key={index}
                  color={item.color}
                  text={item.text}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <Calendar />
      </div>

      <button>회원 탈퇴하기</button>
    </div>
  );
};

export default MyPagePage;

"use client";
import { useState } from "react";
import styles from "./UserName.module.scss";
import useInput from "@/app/(anon)/signup/hooks/useInput";
import Button from "@/components/button/Button";

import { useUser } from "@/context/UserContext";
import { validateNickname } from "@/app/(anon)/signup/hooks/useValidate";

const UserName = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { user, setUser } = useUser();
  const { value: nickname, onChange: handleChangeInput } = useInput("");

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChangeNickname = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const validationError = validateNickname(nickname);
    if (validationError) {
      alert(validationError);
      return;
    }

    const confirmChange = confirm("닉네임을 변경하시겠습니까?");
    if (!confirmChange) return;

    try {
      const response = await fetch("/api/user/update-nickname", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname }),
      });

      let data;

      try {
        data = await response.json();
      } catch {
        alert("서버에서 올바른 응답을 받지 못했습니다.");
        return;
      }

      if (!response.ok) {
        alert(data?.message || "닉네임 변경에 실패했습니다.");
        return;
      }

      if (user) {
        setUser({ ...user, nickname });
      }

      alert("닉네임이 성공적으로 변경되었습니다!");
    } catch {
      alert("서버와의 연결에 문제가 발생했습니다.");
    }

    setIsEditing((prev) => !prev);
  };

  return (
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
              placeholder={user?.nickname}
              className={styles.userNameInput}
            />
          </>
        ) : (
          <div className={styles.userName}>
            <h1>{user?.nickname}</h1>
          </div>
        )}

        <div className={styles.editButtonBox}>
          <Button
            text={isEditing ? "변경" : "수정"}
            size="xs"
            onClick={isEditing ? handleChangeNickname : handleEditClick}
          />
        </div>
      </div>
    </div>
  );
};

export default UserName;

"use client";
import { useEffect, useState } from "react";
import styles from "./UserName.module.scss";
import useInput from "@/app/(anon)/signup/hooks/useInput";
import Button from "@/components/button/Button";

import { useUser } from "@/context/UserContext";
import { validateNickname } from "@/app/(anon)/signup/hooks/useValidate";

const UserName = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { user, setUser } = useUser();
  const {
    value: nickname,
    setValue,
    onChange: handleChangeInput,
  } = useInput("");

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const updateNicknameFetch = async (nickname: string) => {
    try {
      const response = await fetch("/api/user/update-nickname", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(data?.message || "이미 사용 중인 닉네임입니다.");
        }
        throw new Error(data?.message || "닉네임 변경에 실패하였습니다.");
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "서버와의 연결에 문제가 생겼습니다."
      );
    }
  };

  useEffect(() => {
    if (!isEditing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
        setValue("");
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(`.${styles.editingBox}`)) {
        setIsEditing(false);
        setValue("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, user?.nickname, setValue]);

  const handleChangeNickname = async () => {
    if (nickname === user?.nickname) {
      alert("기존 닉네임과 동일합니다.");
      return;
    }

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
      await updateNicknameFetch(nickname);

      if (user) {
        setUser({ ...user, nickname });
      }

      alert("닉네임이 성공적으로 변경되었습니다!");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "이미 사용 중인 닉네임입니다.") {
          alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 시도해주세요.");
        } else {
          alert(error.message || "서버 오류가 발생했습니다.");
        }
      } else {
        alert("서버 오류가 발생했습니다.");
      }
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

"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./PlaceResult.module.scss";

interface PlaceResult {
  member: string[];
  result: {
    place: string;
    place_url: string;
    user: string[];
  }[];
}

const PlaceResult = ({ placeProps }: { placeProps: PlaceResult }) => {
  const placeResult: PlaceResult = placeProps;

  const [selectedMember, setSelectedMember] = useState<string>("전체 참여자");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 바깥쪽 클릭 감지
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false); // 드롭다운 닫기
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSelectMember = (member: string) => {
    setSelectedMember(member);
    setDropdownOpen(false);
  };

  return (
    <div className={styles.placeResultContainer}>
      {/* 상단 전체 참여자 드롭다운 */}
      <div className={styles.header} ref={dropdownRef}>
        <div
          className={styles.dropdown}
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          {selectedMember} <span className={styles.arrow}>▼</span>
        </div>
        <ul
          className={`${styles.dropdownMenu} ${
            isDropdownOpen ? styles.open : ""
          }`}
        >
          <li onClick={() => handleSelectMember("전체 참여자")}>전체 참여자</li>
          {placeResult.member.map((member) => (
            <li key={member} onClick={() => handleSelectMember(member)}>
              {member}
            </li>
          ))}
        </ul>
      </div>

      {/* 장소 리스트 */}
      <div className={styles.placeList}>
        {placeResult.result.map((place, index) => {
          const isSelectedUser =
            selectedMember === "전체 참여자" ||
            place.user.includes(selectedMember);

          return (
            <div
              key={index}
              className={`${styles.placeItem} ${
                isSelectedUser ? "" : styles.disabled
              }`}
            >
              <div className={styles.placeHeader}>
                <span className={styles.placeName}>{place.place}</span>
                {place.place_url && (
                  <a
                    href={place.place_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.placeDetail}
                  >
                    위치보기
                  </a>
                )}
              </div>
              <div className={styles.voterList}>
                <span className={styles.voterTitle}>
                  투표한 사람{" "}
                  <span className={styles.voterCount}>{place.user.length}</span>
                  명
                </span>
                <div className={styles.userList}>
                  {place.user.length > 0 ? (
                    place.user.map((user, idx) => <span key={idx}>{user}</span>)
                  ) : (
                    <span className={styles.noVote}>
                      아직 투표한 사람이 없습니다.
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlaceResult;

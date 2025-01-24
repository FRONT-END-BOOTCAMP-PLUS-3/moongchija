"use client";
import { useState } from "react";
import styles from "./PlaceVote.module.scss";
import Button from "@/components/button/Button";

interface Place {
  place: string;
  place_url: string;
}

const PlaceVote = () => {
  const places: Place[] = [
    { place: "홍대입구", place_url: "https://naver.me/xEABuNEP" },
    { place: "서울역", place_url: "https://naver.me/xEABuNEP" },
    { place: "동대문", place_url: "https://naver.me/xEABuNEP" },
    { place: "동역사", place_url: "https://naver.me/xEABuNEP" },
    { place: "가나다", place_url: "https://naver.me/xEABuNEP" },
  ];
  const [selectedPlace, setSelectedPlace] = useState<string>("");

  const handleSelect = (place: string) => {
    setSelectedPlace(place);
  };
  const handleSubmit = () => {
    if (selectedPlace) {
      console.log("선택된 장소:", selectedPlace); // 콘솔 출력
      alert(`선택된 장소: ${selectedPlace}`); // 사용자 피드백
    } else {
      alert("장소를 선택해주세요.");
    }
  };
  return (
    <div className={styles.placeVoteContainer}>
      <p className={styles.subtitle}>원하는 약속 장소를 선택해주세요.</p>

      <div className={styles.placeList}>
        {places.map((item, index) => (
          <div
            key={index}
            className={`${styles.placeItem} ${
              selectedPlace === item.place ? styles.selected : ""
            }`}
            onClick={() => handleSelect(item.place)}
          >
            <div className={styles.itemTop}>
              <div className={styles.placeName}>{item.place}</div>
              <div
                className={`${styles.radioButton} ${
                  selectedPlace === item.place ? styles.checked : ""
                }`}
              >
                <div
                  className={`${styles.innerButton} ${
                    selectedPlace === item.place ? styles.checked : ""
                  }`}
                ></div>
              </div>
            </div>
            <a
              href={item.place_url}
              target="_blank"
              className={styles.placeLink}
            >
              자세히 보기
            </a>
          </div>
        ))}
      </div>

      <div className={styles.wrapButton} onClick={handleSubmit}>
        <Button text="다음" size="lg" />
      </div>
    </div>
  );
};

export default PlaceVote;

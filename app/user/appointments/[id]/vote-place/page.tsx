"use client";

import ArrowHeader from "@/components/header/ArrowHeader";
import styles from "./votePlace.module.scss";
import Button from "@/components/button/Button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

interface Place {
  place: string;
  place_url: string;
}

const VotePlacePage: React.FC = () => {
  const router = useRouter(); // useRouter 훅 사용 -> router.push로 페이지 이동을위해 사용
  const params = useParams(); // URL에서 ID 추출
  const id = params.id as string; // ID값 추출

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
      alert(`투표가 완료 되었습니다.`);
      router.push(`/user/appointments/${id}/vote-result`);
    } else {
      alert("장소를 선택해주세요.");
    }
  };
  return (
    <div className={styles.placeVoteContainer}>
      <ArrowHeader />
      <div className={styles.mainBox}>
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
                <div className={styles.placeName}>
                  <FaMapMarkerAlt className={styles.markerIcon} />
                  {item.place}
                </div>
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
        <div className={styles.wrapButton}>
          <Button text="투표 완료" size="lg" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default VotePlacePage;

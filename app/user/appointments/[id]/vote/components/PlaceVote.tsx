"use client";
import { useState } from "react";
import styles from "./PlaceVote.module.scss";
import Button from "@/components/button/Button";
import { FaMapMarkerAlt } from "react-icons/fa";

interface Place {
  place: string;
  place_url: string;
}
interface PlaceVoteProps {
  votePlaces: Place[];
  onPlaceSelect: (place: string) => void; // 장소 선택 완료 시 호출되는 함수
}

const PlaceVote: React.FC<PlaceVoteProps> = ({ votePlaces, onPlaceSelect }) => {
  const places: Place[] = votePlaces;
  const [selectedPlace, setSelectedPlace] = useState<string>("");

  const handleSelect = (place: string) => {
    setSelectedPlace(place);
  };
  const handleSubmit = () => {
    if (selectedPlace) {
      onPlaceSelect(selectedPlace);
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

      <div className={styles.wrapButton} onClick={handleSubmit}>
        <Button text="다음" size="lg" />
      </div>
    </div>
  );
};

export default PlaceVote;

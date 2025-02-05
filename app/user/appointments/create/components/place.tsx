"use client";

import styles from "./place.module.scss";
import Button from "@/components/button/Button";
import { useCreateAppointment } from "@/context/CreateAppointmentContext";
import { useEffect, useState } from "react";
import CircleIndicator from "./CircleIndicator";

const MAX_PLACES = 5;

interface Props {
  onPageChange: (index: number) => void;
}

const CreatePlace: React.FC<Props> = ({ onPageChange }) => {
  const { createAppointment } = useCreateAppointment();

  const [places, setPlaces] = useState([{ name: "", url: "" }]);
  const [isButtonActive, setIsButtonActive] = useState(false);

  useEffect(() => {
    const allNamesFilled = places.every((place) => place.name.trim() !== "");
    setIsButtonActive(allNamesFilled);
  }, [places]);

  const handleAddPlace = () => {
    if (places.length < MAX_PLACES) {
      setPlaces([...places, { name: "", url: "" }]);
    }
  };

  const handleRemovePlace = () => {
    if (places.length > 1) {
      setPlaces(places.slice(0, -1));
    }
  };

  const handleChange = (index: number, key: "name" | "url", value: string) => {
    const updatedPlaces = [...places];
    updatedPlaces[index][key] = value;
    setPlaces(updatedPlaces);
  };

  const handleNextButton = () => {
    createAppointment();
    onPageChange(4)
  };

  return (
    <div className={styles.container}>
      <section className={styles.mainBox}>
        <div className={styles.indicatorWrapper}>
          <CircleIndicator total={3} activeIndexs={[0, 1, 2]} />
        </div>

        <p className={styles.title}>약속 장소 후보</p>

        <div className={styles.buttonWrapper}>
          <Button
            size="xs"
            text="+"
            onClick={handleAddPlace}
            color={"--grey-5-color"}
          />
          <Button
            size="xs"
            text="-"
            onClick={handleRemovePlace}
            color={"--grey-5-color"}
          />
        </div>

        <div className={styles.placeWrapper}>
          {places.map((place, index) => (
            <div key={index} className={styles.placeItem}>
              <label>장소 {index + 1}</label>
              <input
                type="text"
                value={place.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="장소명"
              />
              <input
                className={styles.placeUrl}
                type="text"
                placeholder="장소 url (선택)"
                value={place.url}
                onChange={(e) => handleChange(index, "url", e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>
        
      <div className={styles.buttonWrapper}>
      <Button
        size="lg"
        text="약속 생성하기"
        active={isButtonActive}
        onClick={handleNextButton}
      />
      </ div>
    </div>
  );
};

export default CreatePlace;

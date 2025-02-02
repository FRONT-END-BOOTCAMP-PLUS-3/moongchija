"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaMapMarkerAlt } from "react-icons/fa";
import ArrowHeader from "@/components/header/ArrowHeader";
import styles from "./votePlace.module.scss";
import Button from "@/components/button/Button";
import { useTimeVote } from "@/context/TimeVoteContext";
import { getUserIdClient } from "@/utils/supabase/client"; // ✅ 로그인된 유저 ID 가져오기
import { PlaceVote } from "@/domain/entities/PlaceVote";

const VotePlacePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { selectedTimes } = useTimeVote();
  const [places, setPlaces] = useState<PlaceVote[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ 로그인된 유저 ID 가져오기
  useEffect(() => {
    const fetchUserId = async () => {
      const user = await getUserIdClient();
      if (user) {
        setUserId(user);
      } else {
        console.warn("❌ 유저 정보 없음, 로그인 필요");
        // router.push("/login"); // 🚀 로그인 안 된 경우 로그인 페이지로 이동
      }
    };
    fetchUserId();
  }, [router]);

  // ✅ 서버에서 약속 장소 리스트 가져오기
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(`/api/user/appointments/${id}/place-vote`);
        if (!response.ok) throw new Error("Failed to fetch place votes");

        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching place votes:", error);
      }
    };

    if (id) fetchPlaces();
  }, [id]);

  const handleSelect = (place: string) => {
    setSelectedPlace(place);
  };

  const handleSubmit = async () => {
    if (!selectedPlace) {
      alert("장소를 선택해주세요.");
      return;
    }
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const voteData = {
      appointmentId: parseInt(id),
      userId, // ✅ 실제 로그인된 사용자 ID 포함
      timeVotes: selectedTimes.map((time) => ({ time })),
      placeVotes: [{ place: selectedPlace }],
    };

    try {
      const response = await fetch(`/api/user/appointments/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voteData),
      });

      if (response.ok) {
        alert("투표가 완료되었습니다!");
        router.push(`/user/appointments/${id}/vote-result`);
      } else {
        const error = await response.json();
        alert(`투표 저장 실패: ${error.message}`);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("투표 저장 중 오류 발생");
    }
  };

  return (
    <div className={styles.placeVoteContainer}>
      <ArrowHeader />
      <div className={styles.mainBox}>
        <p className={styles.subtitle}>원하는 약속 장소를 선택해주세요.</p>

        <div className={styles.placeList}>
          {places.length === 0 ? (
            <p>장소를 불러오는 중...</p>
          ) : (
            places.map((item, index) => (
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
            ))
          )}
        </div>
        <div className={styles.wrapButton}>
          <Button text="투표 완료" size="lg" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default VotePlacePage;

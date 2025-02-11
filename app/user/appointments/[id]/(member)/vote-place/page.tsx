"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaMapMarkerAlt } from "react-icons/fa";
import styles from "./votePlace.module.scss";
import Button from "@/components/button/Button";
import { useTimeVote } from "@/context/TimeVoteContext";
import { PlaceVote } from "@/domain/entities/PlaceVote";
import Loading from "@/components/loading/Loading";
import { useUser } from "@/context/UserContext";

const VotePlacePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { selectedTimes } = useTimeVote();
  const { user } = useUser();
  const [places, setPlaces] = useState<PlaceVote[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<number>();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(`/api/user/appointments/${id}/place-vote`);
        if (!response.ok) throw new Error("❌ 장소 투표 리스트 가져오기 실패");

        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        console.log("❌ 장소 투표 리스트 가져오기 실패:", error);
      }
    };

    fetchPlaces();
  }, [id]);

  const handleSelect = (placeId: number) => {
    setSelectedPlace(placeId);
  };

  const handleSubmit = async () => {
    if (!selectedPlace) {
      alert("❌ 장소를 선택해주세요.");
      return;
    }
    if (!user) {
      alert("❌ 로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    try {
      const response = await fetch(`/api/user/appointments/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          timeVotes: selectedTimes.map((time) => ({ time })),
          placeVotes: [{ placeId: selectedPlace }],
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        // ❌ 서버에서 반환한 오류 메시지를 alert로 띄움
        alert(`❌ 투표 실패: ${responseData.error || "알 수 없는 오류"}`);
        return;
      } else {
        alert("✅ 투표가 완료되었습니다! 투표결과페이지로 이동합니다.");
        router.push(`/user/appointments/${id}/vote-result`);
      }
    } catch (error) {
      console.log("❌ 투표 저장 중 오류 발생:", error);
      alert("❌ 투표 저장 중 오류 발생");
    }
  };

  if (!places.length) {
    return <Loading />; // 데이터 로딩 전 UI
  }
  return (
    <div className={styles.placeVoteContainer}>
      <div className={styles.mainBox}>
        <p className={styles.subtitle}>원하는 약속 장소를 선택해주세요.</p>

        <div className={styles.placeList}>
          {places.map((item, index) => (
            <div
              key={index}
              className={`${styles.placeItem} ${
                selectedPlace === item.id ? styles.selected : ""
              }`}
              onClick={() => item.id !== undefined && handleSelect(item.id)}
            >
              <div className={styles.itemTop}>
                <div className={styles.placeName}>
                  <FaMapMarkerAlt className={styles.markerIcon} />
                  {item.place}
                </div>
                <div
                  className={`${styles.radioButton} ${
                    selectedPlace === item.id ? styles.checked : ""
                  }`}
                >
                  <div
                    className={`${styles.innerButton} ${
                      selectedPlace === item.id ? styles.checked : ""
                    }`}
                  ></div>
                </div>
              </div>
              {item.place_url && (
                <a
                  href={item.place_url}
                  target="_blank"
                  className={styles.placeLink}
                >
                  위치 보기
                </a>
              )}
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

import { useEffect, useState } from "react";
import { useCreateAppointment } from "@/context/CreateAppointmentContext";

const MAX_PLACES = 5;

const useCreatePlace = (onPageChange: (index: number) => void) => {
  const { placeVotes, setPlaceVotes, createAppointment, loading } = useCreateAppointment();
  const [isButtonActive, setIsButtonActive] = useState(false);

  // 모든 장소가 입력되었는지 확인하여 버튼 활성화 여부 설정
  useEffect(() => {
    const allNamesFilled = placeVotes.every((place) => place.place.trim() !== "");
    setIsButtonActive(allNamesFilled);
  }, [placeVotes]);

  // 장소 후보 추가 (최대 5개)
  const handleAddPlace = () => {
    if (placeVotes.length < MAX_PLACES) {
      setPlaceVotes([...placeVotes, { place: "", place_url: "", appointment_id: null }]);
    }
  };

  // 마지막 장소 후보 삭제 (최소 1개는 유지)
  const handleRemovePlace = () => {
    if (placeVotes.length > 1) {
      setPlaceVotes(placeVotes.slice(0, -1));
    }
  };

  // 특정 장소 정보 수정 (이름 또는 URL)
  const handleChange = (index: number, key: "place" | "place_url", value: string) => {
    const updatedPlaces = [...placeVotes];
    updatedPlaces[index][key] = value;
    setPlaceVotes(updatedPlaces);
  };

  // "약속 생성하기" 버튼 클릭 시 약속 생성 및 페이지 이동
  const handleNextButton = async () => {
    try {
      await createAppointment();
      onPageChange(4);
    } catch {
      alert("약속 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return {
    hooks: {
      placeVotes,
      isButtonActive,
      loading,
    },
    handlers: {
      handleAddPlace,
      handleRemovePlace,
      handleChange,
      handleNextButton,
    },
  };
};

export default useCreatePlace;

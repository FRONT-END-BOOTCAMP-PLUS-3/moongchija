import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { AppointmentCardDto } from "@/application/usecases/appointment/dto/AppointmentCardDto";
import { calculateCountdown } from "@/utils/dateUtils/dateUtils";

const useAppointments = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [appointments, setAppointments] = useState<AppointmentCardDto[]>([]);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("전체");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 상태 관리
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 약속 필터링 (투표중)
  const inProgressAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status === "voting"),
    [appointments]
  );
  // 약속 필터링 (확정)
  const confirmedAppointments = useMemo(() => appointments.filter(
    (appointment) => appointment.status === "confirmed"
  ), [appointments]);

  // 이벤트 핸들러
  const handleTabChange = (index: number) => setCurrentTab(index);
  const handleCircleButtonClick = () => setShowButtons((prev) => !prev);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedOption(e.target.value);

  // 검색 필터
  const filteredAppointments = useCallback(
    (appointments: AppointmentCardDto[]) => {
      return appointments
        .filter((appointment) => {
          if (selectedOption === "방장" && !appointment.isCreator) return false;
  
          if (
            selectedOption === "예정" &&
            !calculateCountdown(appointment.confirmDate!).includes("D-")
          ) return false;
  
          if (
            selectedOption === "종료" &&
            calculateCountdown(appointment.confirmDate!) !== "종료"
          ) return false;
  
          return true;
        })
        .filter((appointment) => {
          return appointment.title
            .toLowerCase()
            .includes(searchText.toLowerCase());
        });
    },
    [searchText, selectedOption]
  );

  // 약속 데이터 불러오기
  const fetchAppointments = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/appointments?userId=${user?.id}`);
      if (!response.ok) throw new Error("Failed to fetch appointments");

      const appointments: AppointmentCardDto[] = await response.json();
      const parsedAppointments: AppointmentCardDto[] = appointments.map(
        (appointment) => ({
          ...appointment,
          startDate: appointment.startDate
            ? new Date(appointment.startDate)
            : undefined,
          endDate: appointment.endDate
            ? new Date(appointment.endDate)
            : undefined,
          confirmDate: appointment.confirmDate
            ? new Date(appointment.confirmDate)
            : undefined,
        })
      );

      setAppointments(parsedAppointments);
      
    } catch (error) {
      alert(`❌ 오류가 발생했습니다: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchAppointments();
  }, [fetchAppointments]);

  return {
    hooks: {
      loading,
      currentTab,
      showButtons,
      searchText,
      selectedOption,
      isModalOpen,
    },
    handlers: {
      openModal,
      closeModal,
      handleTabChange,
      handleCircleButtonClick,
      handleSearchChange,
      handleSelectChange,
      filteredAppointments,
      inProgressAppointments,
      confirmedAppointments,
    }
  };
};

export default useAppointments;

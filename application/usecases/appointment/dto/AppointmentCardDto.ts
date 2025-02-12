export interface AppointmentCardDto {
    id?: number | null;
    title: string;
    startDate?: Date; // 시작 날짜 (투표 진행 중에서만 사용)
    endDate?: Date; // 종료 날짜 (투표 진행 중에서만 사용)
    confirmDate?: Date; // 확정된 날짜 (약속 리스트에서만 사용)
    confirmPlace?: string; // 확정된 장소 (약속 리스트에서만 사용)
    participants: string[];
    isCreator: boolean;
    extraParticipants: number;
    status: "voting" | "confirmed"
    isVote: boolean // 현재 유저가 해당 약속에 대한 투표 유무
    ownerId: string;
  }
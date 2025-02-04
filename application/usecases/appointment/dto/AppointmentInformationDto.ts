export interface AppointmentInformationDto {
  id: number;
  title: string;
  confirmPlace?: string;
  confirmPlaceUrl?: string;
  confirmDate?: Date;
  participants: {
    nickname: string;
    emoji: string;
  }[];
  notices?: {
    id: number;
    descript: string;
    createdAt: Date;
  }[];
}

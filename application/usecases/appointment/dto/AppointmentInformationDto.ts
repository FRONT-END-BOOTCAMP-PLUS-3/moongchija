import { NoticeItemDto } from "./NoticeDto";

export interface AppointmentInformationDto {
  id: number;
  title: string;
  confirmPlace?: string;
  confirmPlaceUrl?: string;
  confirmDate?: Date;
  owner_id: string;
  participants: {
    nickname: string;
    emoji: string;
  }[];
  notices?: NoticeItemDto[];
}

export interface NoticeDto {
  notices?: NoticeItemDto[];
}

export interface NoticeItemDto {
  id: number;
  descript: string;
  createdAt: Date;
}


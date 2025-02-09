export interface SettlementDto {
  id: number;
  accountNumber: string;
  accountHolderName: string;
  bank: string;
  appointmentId: number;
  memberCount: number;
  createdAt: Date;
  details: {
    id: number;
    amount: number;
    descript: string;
    createdAt: Date;
  }[];
}
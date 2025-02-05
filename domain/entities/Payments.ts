export interface Payments {
  id: number;
  account_number: string;
  account_holder_name: string;
  bank: string;
  appointment_id: number;
  member_count: number;
  created_at: Date;
}
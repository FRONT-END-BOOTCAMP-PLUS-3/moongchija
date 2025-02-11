import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { PaymentsRepository } from "@/domain/repositories/PaymentsRepository";
import { Payments } from "@/domain/entities/Payments";

export class SbPaymentsRepository implements PaymentsRepository {
  private async getClient(): Promise<SupabaseClient> {
    return await createClient();
  }

  
  async create(
    appointmentId: number,
    accountNumber: string,
    accountHolderName: string,
    bank: string,
    memberCount: number
  ): Promise<void> {
    const supabase = await this.getClient();
    const { error } = await supabase
      .from("payments")
      .insert([
        {
          appointment_id: appointmentId,
          account_number: accountNumber,
          account_holder_name: accountHolderName,
          bank,
          member_count: memberCount,
        },
      ]);

    if (error) {
      throw new Error(`정산 정보 생성 실패: ${error.message}`);
    }
  }

  async findByAppointmentId(appointmentId: number): Promise<Payments | null> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("appointment_id", appointmentId)
      .single();

    if (error) {
      console.log("정산 정보 조회 실패:", error.message);
      return null;
    }

    return data || null;
  }



  async delete(paymentsId: number): Promise<void> {
    const supabase = await this.getClient();
    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", paymentsId);

    if (error) {
      throw new Error(`정산 정보 삭제 실패: ${error.message}`);
    }
  }
}

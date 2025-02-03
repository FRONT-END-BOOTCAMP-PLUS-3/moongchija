import { Member } from "@/domain/entities/Member";
import { MemberRepository } from "@/domain/repositories/MemberRepository";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export class SbMemberRepository implements MemberRepository {
    private async getClient(): Promise<SupabaseClient> {
        return await createClient();
    }

    async findByAppointment_id(appointment_id: number): Promise<Member[]> {
        const client = await this.getClient();
        const { data, error } = await client
            .from('member')
            .select()
            .eq('appointment_id', appointment_id);
        if (error) {
            throw new Error(`Error finding member by appointment ID: ${error.message}`);
        }
        return data;
    }
    
    async create(member: Member): Promise<Member[]> {
        const client = await this.getClient();
        const { data, error } = await client
            .from('member')
            .insert(member)
            .select();
        if (error) {
            throw new Error(`Error creating member: ${error.message}`);
        }
        return data;
    }

    async findByUserId(userId: string): Promise<Member[]> {
        const client = await this.getClient();
        const { data, error } = await client
            .from('member')
            .select()
            .eq('user_id', userId);
        if (error) {
            throw new Error(`Error finding member by user ID: ${error.message}`);
        }
        return data;
    }
}
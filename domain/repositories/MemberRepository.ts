import { Member } from './../entities/Member';


export interface MemberRepository {
    create(member: Member): Promise<Member[]>

    findByUserId(userId: string): Promise<Member[]>
    
    findByAppointment_id(appointment_id: number): Promise<Member[]>
}
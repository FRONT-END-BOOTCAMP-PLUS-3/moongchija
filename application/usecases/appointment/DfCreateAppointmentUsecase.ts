
import { AppointmentRepository } from '@/domain/repositories/AppointmentRepository';
import { PlaceVoteRepository } from '@/domain/repositories/PlaceVoteRepository';
import { MemberRepository } from './../../../domain/repositories/MemberRepository';
import { Appointment } from '@/domain/entities/Appointment';
import { PlaceVote } from './../../../domain/entities/PlaceVote';
import { getUserIdClient } from '@/utils/supabase/client';

export class DfCreateAppointmentUsecase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private placeVoteRepository: PlaceVoteRepository,
    private memberRepository: MemberRepository
  ) {}

  async execute(appointment: Appointment, placeVote: PlaceVote[]): Promise<Appointment> {
    const userId = await getUserIdClient();
    
    const newAppointment = await this.appointmentRepository.create(appointment);
    
    if (userId && newAppointment.id) {
      await this.placeVoteRepository.create(placeVote);
      await this.memberRepository.addMemberToAppointment(userId, newAppointment.id);  
    }

    return newAppointment;
  }
}

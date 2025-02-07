
import { AppointmentRepository } from '@/domain/repositories/AppointmentRepository';
import { PlaceVoteRepository } from '@/domain/repositories/PlaceVoteRepository';
import { MemberRepository } from './../../../domain/repositories/MemberRepository';
import { Appointment } from '@/domain/entities/Appointment';
import { PlaceVote } from './../../../domain/entities/PlaceVote';

export class DfCreateAppointmentUsecase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private placeVoteRepository: PlaceVoteRepository,
    private memberRepository: MemberRepository
  ) {}

  async execute(appointment: Appointment, placeVote: PlaceVote[]): Promise<Appointment> {    
    const newAppointment = await this.appointmentRepository.create(appointment);
    
    if (newAppointment) {
      const newPlaceVotes = placeVote.map((place) => ({...place, appointment_id: newAppointment.id!}))

      await this.placeVoteRepository.create(newPlaceVotes);
      await this.memberRepository.addMemberToAppointment(newAppointment.owner_id, newAppointment.id!);  
    }

    return newAppointment;
  }
}

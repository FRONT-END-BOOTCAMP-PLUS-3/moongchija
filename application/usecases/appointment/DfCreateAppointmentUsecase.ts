
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
    console.log("약속 만들기");
    const newAppointment = await this.appointmentRepository.create(appointment);
    console.log('newAppointment', newAppointment);
    
    if (newAppointment) {
      console.log("장소, 멤버 추가")
      const newPlaceVotes = placeVote.map((place) => ({...place, appointment_id: newAppointment.id!}))
      console.log('newPlaceVotes', newPlaceVotes)
      await this.placeVoteRepository.create(newPlaceVotes);
      await this.memberRepository.addMemberToAppointment(newAppointment.owner_id, newAppointment.id!);  
    }

    return newAppointment;
  }
}

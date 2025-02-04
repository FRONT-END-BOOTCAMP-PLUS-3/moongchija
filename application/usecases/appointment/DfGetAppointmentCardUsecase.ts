import { AppointmentRepository } from "@/domain/repositories/AppointmentRepository";
import { MemberRepository } from "@/domain/repositories/MemberRepository";
import { AppointmentCardDto } from "./dto/AppointmentCardDto";
import { Member } from "@/domain/entities/Member";
import { Appointment } from "@/domain/entities/Appointment";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { User } from "@/domain/entities/User";

export class DfAppointmentCardUsecase {
    constructor(
      private userRepository: UserRepository,
      private memberRepository: MemberRepository,
      private appointmentRepository: AppointmentRepository
    ) {}
  
    async execute(): Promise<AppointmentCardDto[]> {
      const userId = "d832351e-564b-4d1a-b07a-e57edbd7b99e"; // TODO: 사용자 ID 쿠키에서 가져오게끔 수정하기
  
      const membersByUserId: Member[] = await this.memberRepository.findByUserId(userId);
      const appointmentIds: number[] = membersByUserId.map(m => m.appointment_id);
  
      const appointments: Appointment[] = (await this.appointmentRepository.findByIds(appointmentIds)) || [];
  
      const appointmentDtos: AppointmentCardDto[] = await Promise.all(
        appointments.map(async (appointment) => {
          const membersByAppointmentId: Member[] = await this.memberRepository.findByAppointment_id(appointment.id);
          const memberIds: string[] = membersByAppointmentId.map(member => member.user_id);
          const participants: User[] = await this.userRepository.findByIds(memberIds);

          
  
          return {
            id: appointment.id,
            title: appointment.title,
            startDate: new Date(appointment.start_time),
            endDate: new Date(appointment.end_time),
            confirmDate: appointment.confirm_time ? new Date(appointment.confirm_time) : undefined,
            confirmPlace: appointment.confirm_place ? appointment.confirm_place : undefined,
            participants: participants.map(user => user.emoji),
            isCreator: appointment.owner_id === userId,
            extraParticipants: participants?.length ? Math.max(0, participants.length - 5) : 0,
          };
        })
      );
  
      return appointmentDtos;
    }
  }
  

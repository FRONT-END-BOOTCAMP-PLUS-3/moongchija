import { AppointmentRepository } from "@/domain/repositories/AppointmentRepository";
import { MemberRepository } from "@/domain/repositories/MemberRepository";
import { AppointmentCardDto } from "./dto/AppointmentCardDto";
import { Appointment } from "@/domain/entities/Appointment";
import { UserRepository } from "@/domain/repositories/UserRepository";

export class DfAppointmentCardUsecase {
  constructor(
    private userRepository: UserRepository,
    private memberRepository: MemberRepository,
    private appointmentRepository: AppointmentRepository
  ) {}

  async execute(userId: string): Promise<AppointmentCardDto[]> {
    const members = await this.memberRepository.findByUserId(userId);
    const appointmentIds = members.map(m => m.appointment_id);

    if (appointmentIds.length === 0) return [];

    const appointments = await this.appointmentRepository.findByIds(appointmentIds) ?? [];

    const dtos = await Promise.all(appointments.map(appointment => this.mapToDto(appointment, userId)));
    
    return dtos.flat(); // 빈 배열 반환 가능성을 고려하여 flat() 사용
  }

  private async mapToDto(appointment: Appointment, userId: string): Promise<AppointmentCardDto | []> {
    const members = await this.memberRepository.findByAppointmentId(appointment.id!);
    if (!members.length) return [];

    const participants = await this.userRepository.findByIds(members.map(m => m.user_id));
    if (!participants.length) return [];

    return {
      id: appointment.id ?? null,
      title: appointment.title,
      startDate: new Date(appointment.start_time),
      endDate: new Date(appointment.end_time),
      confirmDate: appointment.confirm_time ? new Date(appointment.confirm_time) : undefined,
      confirmPlace: appointment.confirm_place || undefined,
      participants: participants.map(user => user.emoji),
      isCreator: appointment.owner_id === userId,
      extraParticipants: Math.max(0, participants.length - 5),
      status: appointment.status as "voting" | "confirmed",
      isVote: members.some(m => m.user_id === userId && m.is_vote),
      ownerId: appointment.owner_id,
    };
  }
}



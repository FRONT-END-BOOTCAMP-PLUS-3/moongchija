import { AppointmentRepository } from "@/domain/repositories/AppointmentRepository";
import { Appointment } from "@/domain/entities/Appointment";
import { MemberRepository } from "@/domain/repositories/MemberRepository";
import { Member } from "@/domain/entities/Member";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { User } from "@/domain/entities/User";
import { AppointmentInformationDto } from "./dto/AppointmentInformationDto";
import { Notice } from "@/domain/entities/Notice";
import { NoticeRepository } from "@/domain/repositories/NoticeRepository";


export class DfGetAppointmentInformationUsecase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private memberRepository: MemberRepository,
    private userRepository: UserRepository,
    private noticeRepository: NoticeRepository,
  ) { }

  async execute(appointmentId: number): Promise<Partial<AppointmentInformationDto> | null> {


    // 해당 약속 id에 해당하는 약속 데이터 가져오기
    const appointment: Appointment | null = await this.appointmentRepository.findById(appointmentId);

    if (!appointment) {
      return null; // 약속이 존재하지 않으면 null 반환
    }

    // 멤버 구성원 받아오기

    // (1) 해당 약속 id에 해당하는 멤버 테이블을 배열로 받아옴
    const membersByAppointmentId: Member[] = await this.memberRepository.findByAppointmentId(appointmentId);

    // (2) 멤버 테이블 배열 중에서 user_id만 가져와서 배열에 담음
    const memberIds: string[] = membersByAppointmentId.map(member => member.user_id);

    // (3) user_id 배열 (구성원)에 해당하는 유저 테이블을 배열로 받아옴 
    const participants: User[] = await this.userRepository.findByIds(memberIds);


    // 공지사항 받아오기
    const noticesByAppointmentId: Notice[] | null = await this.noticeRepository.findById(appointmentId);

    // notices가 null이 아닐 경우, 필요한 필드만 추출하여 배열로 변환
    const notices = noticesByAppointmentId ? noticesByAppointmentId.map(notice => ({
      id: notice.id,
      descript: notice.descript,
      createdAt: notice.created_at,
    })) : [];

    // DTO 객체 생성 및 반환
    return {
      id: appointmentId,
      title: appointment.title,
      confirmPlace: appointment.confirm_place || undefined,
      confirmPlaceUrl: appointment.confirm_place_url || undefined,
      confirmDate: appointment.confirm_time ? new Date(appointment.confirm_time) : undefined,
      participants: participants.map(user => ({
        nickname: user.nickname,
        emoji: user.emoji,
      })),
      notices,
    };
  }
}

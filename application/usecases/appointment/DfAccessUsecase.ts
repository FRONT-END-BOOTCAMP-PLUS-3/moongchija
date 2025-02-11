import { UserRepository } from "@/domain/repositories/UserRepository";
import { MemberRepository } from "@/domain/repositories/MemberRepository";
import { AccessDto } from "../vote/dto/AccessDto";

export class DfAccessUsecase {
  constructor(
    private memberRepository: MemberRepository,
    private userRepository: UserRepository
  ) {}

  async execute(ids: AccessDto): Promise<boolean> {
    const { appointmentId, userId } = ids;

    const isMember = await this.memberRepository.isUserInAppointment(
      userId,
      appointmentId
    );
    const isAdmin = await this.userRepository.isUserInAdmin(userId);

    if (!isMember && !isAdmin) {
      throw new Error("해당 약속에 접근 권한이 없습니다.");
    }

    return isMember || isAdmin;
  }
}

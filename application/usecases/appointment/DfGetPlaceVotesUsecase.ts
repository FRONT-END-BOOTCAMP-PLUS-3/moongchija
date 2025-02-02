import { PlaceVoteRepository } from "@/domain/repositories/PlaceVoteRepository";
import { PlaceVoteDto, PlaceVoteMapper } from "./dto/PlaceVoteDto";

export class DfGetPlaceVotesUsecase {
  constructor(private repository: PlaceVoteRepository) {}

  async execute(appointmentId: number): Promise<PlaceVoteDto[]> {
    const placeVotes = await this.repository.getPlacesByAppointment(
      appointmentId
    );
    return PlaceVoteMapper.toDtoList(placeVotes);
  }
}

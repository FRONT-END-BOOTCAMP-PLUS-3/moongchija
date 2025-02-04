import { PlaceVote } from "@/domain/entities/PlaceVote";

export interface PlaceVoteDto {
  id: number;
  place: string;
  place_url?: string;
}

export class PlaceVoteMapper {
  static toDto(placeVote: PlaceVote): PlaceVoteDto {
    return {
      id: placeVote.id,
      place: placeVote.place,
      place_url: placeVote.place_url || "",
    };
  }

  static toDtoList(placeVotes: PlaceVote[]): PlaceVoteDto[] {
    return placeVotes.map((placeVote) => this.toDto(placeVote));
  }
}

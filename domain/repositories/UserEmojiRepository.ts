export interface UserEmojiRepository {
  createUserRandomEmoji(): Promise<string>;
}

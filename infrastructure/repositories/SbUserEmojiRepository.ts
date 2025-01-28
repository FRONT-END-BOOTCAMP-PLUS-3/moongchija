import { UserEmojiRepository } from "@/domain/repositories/UserEmojiRepository";
import { createClient } from "@/utils/supabase/server";

export class SbUserEmojiRepository implements UserEmojiRepository {
  async createUserRandomEmoji(): Promise<string> {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from("images")
      .list("emojis/", { limit: 100 });

    if (error) {
      console.error("Error fetching emoji list:", error.message);
      throw new Error("이모지 목록을 가져오는 데 실패했습니다.");
    }

    if (!data || data.length === 0) {
      throw new Error("이모지 목록이 비어 있습니다.");
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    const selectedEmojiFile = data[randomIndex];

    const { data: emojiUrl } = await supabase.storage
      .from("images")
      .getPublicUrl(`emojis/${selectedEmojiFile.name}`);

    if (emojiUrl) {
      return emojiUrl.publicUrl;
    } else {
      throw new Error("이모지 URL이 존재하지 않습니다.");
    }
  }
}

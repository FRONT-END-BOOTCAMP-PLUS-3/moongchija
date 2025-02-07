"use client";

export const getEmojiAltText = (emoji: string) => {
  const altText = emoji.split("/").pop()?.split(".")[0] ?? "emoji";

  return altText;
};

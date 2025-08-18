export const getDiscordAvatarURL = (
  discordID: string,
  avatar: string | null
) => {
  if (!avatar) {
    // get default avatar of user
    return `https://cdn.discordapp.com/embed/avatars/${discordID}.png`;
  }
  return `https://cdn.discordapp.com/avatars/${discordID}/${avatar}.png`;
};

export const getDiscordGuildIconURL = (guildID: string, guildIcon: string) => {
  return `https://cdn.discordapp.com/icons/${guildID}/${guildIcon}.png`;
};

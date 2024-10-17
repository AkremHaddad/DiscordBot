const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins the voice channel you are currently in"),
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        content: "You need to be in a voice channel to use this command!",
        ephemeral: true,
      });
    }

    try {
      // Join the voice channel
      joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      await interaction.reply(`Joined ${voiceChannel.name}!`);
    } catch (error) {
      console.error("Error joining the voice channel:", error);
      await interaction.reply({
        content: "Failed to join the voice channel.",
        ephemeral: true,
      });
    }
  },
};

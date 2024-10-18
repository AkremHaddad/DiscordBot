const { SlashCommandBuilder } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playonepiece")
    .setDescription("Plays the One Piece theme song"),
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
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      // Create an audio player
      const player = createAudioPlayer();

      // Define the path to your audio file
      const audioPath = path.join(__dirname, "../audio/secks.mp3"); // Adjust this path accordingly

      // Create an audio resource
      const resource = createAudioResource(audioPath);

      // Subscribe the connection to the audio player
      connection.subscribe(player);

      // Play the audio
      player.play(resource);

      // Notify the user
      await interaction.reply(`Now playing: One Piece theme!`);
    } catch (error) {
      console.error("Error playing the audio file:", error);
      await interaction.reply({
        content: "Failed to play the audio file.",
        ephemeral: true,
      });
    }
  },
};

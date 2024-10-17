// /commands/tag.js
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tag")
    .setDescription('Tags a user and says "the one piece is real @..."')
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Select a user to tag")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("target");
    await interaction.reply(`The one piece is real ${user} `);
  },
};

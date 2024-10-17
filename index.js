// Load environment variables
require("dotenv").config();
const {
  Client,
  IntentsBitField,
  REST,
  Routes,
  SlashCommandBuilder,
} = require("discord.js");

// Now load the environment variables from .env
const token = process.env.TOKEN; // Use TOKEN from .env
const CLIENT_ID = process.env.CLIENT_ID; // Use CLIENT_ID from .env
const GUILD_ID = process.env.GUILD_ID; // Use GUILD_ID from .env

// Create a new client instance
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// When the client is ready, run this code once
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Slash Command Setup
const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
];

// Register slash commands
const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

// Handle interaction events (Slash Command)
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

// Log in to Discord
client.login(token);

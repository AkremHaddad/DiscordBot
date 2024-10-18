require("dotenv").config(); // Load environment variables from .env file
const {
  Client,
  IntentsBitField,
  Collection,
  REST,
  Routes,
} = require("discord.js");
const fs = require("fs");

// Access your token and client ID from the environment variables
const token = process.env.TOKEN; // Your bot token
const clientId = process.env.CLIENT_ID; // Your client ID
const guildId = process.env.GUILD_ID; // Your guild ID (if needed)

// Create a new client instance
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Load commands into the bot
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Event handler for when the bot is ready
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const commands = [
    {
      name: "tag",
      description: 'Tags a user and says "the one piece is real @..."',
      options: [
        {
          type: 6, // USER type
          name: "target",
          description: "Select a user to tag",
          required: true,
        },
      ],
    },
    {
      name: "join",
      description: "Joins the voice channel you are currently in",
    },
    {
      name: "playonepiece",
      description: "Plays the One Piece theme song in the voice channel",
    },
  ];

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    // Register commands for the guild
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
});

// Event handler for interaction (slash command)
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error executing this command!",
      ephemeral: true,
    });
  }
});

// Log the bot into Discord
client.login(token);

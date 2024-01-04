import fs from "node:fs";
import path from "node:path";
import { Collection, Events } from "discord.js";
import { client } from "./Client";
import config from "./Config";

//@ts-ignore
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".ts"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// console.log(command);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ("data" in command.default && "execute" in command.default) {
			console.log(
				`Loaded command '${command.default.data.name}' (${filePath})`,
			);
			client.commands.set(command.default.data.name, command.default);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}
}

client.once(Events.ClientReady, () => {
	console.log(
		`\nEmerald ready as ${client.user?.username}#${client.user?.discriminator}!`,
	);
});

client.on(Events.InteractionCreate, async (interaction) => {
	// console.log(interaction);
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		}
	}
});

client.login(config.token);

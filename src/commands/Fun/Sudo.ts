import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('sudo')
		.setDescription('Sends a message pretending to be another user')
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('Define the user')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('message')
				.setDescription('Define the message')
				.setRequired(true)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;

		const user = options.getUser('user');
		const message = options.getString('message');

		// Creates an webhook with the name and pic of the one selected
		//@ts-ignore
		const webhook = await interaction.channel?.createWebhook({
			name: `${user?.username}`,
			avatar: `${user?.displayAvatarURL()}`,
		});

		await webhook.send(message).then(async () => {
			await webhook.delete();
		});

		await interaction.reply({
			content: `Message was successfully sent!`,
			ephemeral: true,
		});
	},
};

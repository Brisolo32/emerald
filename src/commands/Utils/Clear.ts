import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	EmbedBuilder,
} from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears messages from chat')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addIntegerOption((option) =>
			option
				.setName('number')
				.setDescription('Number of messages to be deleted')
				.setMinValue(1)
				.setRequired(true)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const { channel, options } = interaction;
		let amount: any = options.getInteger('number');

		const messages = await channel?.messages.fetch({
			limit: amount + 1,
		});

		const res = new EmbedBuilder().setColor(0x5fb041);

		//@ts-ignore
		await channel?.bulkDelete(amount, true).then((messages) => {
			res.setDescription(`:broom: | Deleted ${messages.size} message(s)`);
			interaction.reply({ embeds: [res] });
		});
	},
};

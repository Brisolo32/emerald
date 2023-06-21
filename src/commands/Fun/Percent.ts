import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { randomNumber } from '../../funcs/Utils';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('percent')
		.setDescription('What percentage are you ____')
		.addStringOption((option) =>
			option
				.setName('percentage')
				.setDescription('The amount you want to check')
				.setRequired(false)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, user } = interaction;
		const percentage = options.getString('percentage');

		const embed = new EmbedBuilder().setColor(0x5fb041);
		const amount = randomNumber(-1, 101);

		embed.setDescription(
			`${
				amount === 101 // If amount is equal to 101
					? ':interrobang:' // Return ":interrobang:"
					: amount === 100 // If amount is 100
					? ':100:' // Return ":100:"
					: ':thinking:' //
			} | **${user}**, you are ${amount}% ${percentage}`
		);

		await interaction.reply({ embeds: [embed] });
	},
};

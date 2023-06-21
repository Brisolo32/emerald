import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { randomNumber } from '../../funcs/Utils';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flips a coin'),
	async execute(interaction: ChatInputCommandInteraction) {
		const randomValue = randomNumber(0, 2);
		const embed = new EmbedBuilder()
			.setColor(0x5fb041)
			.setDescription(`:coin: | ${randomValue == 1 ? 'Heads' : 'Tails'}`);

		await interaction.reply({
			embeds: [embed],
		});
	},
};

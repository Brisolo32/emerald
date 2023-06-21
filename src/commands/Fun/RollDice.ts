import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { parseDice } from '../../funcs/ParseRPG';
import { randomNumber } from '../../funcs/Utils';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('rolldice')
		.setDescription(
			'Rolls a dice, using either side number or RPG notation (ex: 3d5)'
		)
		.addStringOption((option) =>
			option
				.setName('type')
				.setDescription('Amount of sides or RPG notation')
				.setRequired(false)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const diceType = options.getString('type');

		const embed = new EmbedBuilder().setColor(0x5fb041);

		if (diceType === null) {
			const diceValue = randomNumber(1, 6);
			embed.setDescription(`:game_die: | You rolled a ${diceValue}`);

			await interaction.reply({
				embeds: [embed],
			});
		} else {
			const dice = parseDice(diceType);
			const rolledValues: number[] = [];

			for (let i = 0; i < dice.amount; i++) {
				let rolledDice = randomNumber(1, dice.sides);
				rolledValues.push(rolledDice);
			}

			const description = `:game_die: | You rolled a ${rolledValues
				.toString()
				.replace(/,(?=.*,)/g, ', ')
				.replace(/,(?=[^,]*$)/, ' and ')}`;

			if (description.length > 4086) {
				embed.setDescription(':moyai: | Bruh.');

				await interaction.reply({
					embeds: [embed],
					ephemeral: true,
				});
			} else {
				embed.setDescription(
					`:game_die: | You rolled a ${rolledValues
						.toString()
						.replace(/,(?=.*,)/g, ', ')
						.replace(/,(?=[^,]*$)/, ' and ')}`
				);

				await interaction.reply({
					embeds: [embed],
				});
			}
		}
	},
};

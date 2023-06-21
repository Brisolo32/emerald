import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { client } from '../../Client';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Checks the ping'),
	async execute(interaction: ChatInputCommandInteraction) {
		const embed = new EmbedBuilder().setColor(0x5fb041);

		embed.setDescription(
			`:ping_pong: | Latency is ${
				Date.now() - interaction.createdTimestamp
			}ms. API latency is ${Math.round(client.ws.ping)}ms`
		);

		await interaction.reply({ embeds: [embed] });
	},
};

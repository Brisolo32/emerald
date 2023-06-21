import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import Uwuifier from 'uwuifier';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('uwuifier')
		.setDescription('OwO converts your message to a uwuified one *sweats*')
		.addStringOption((option) =>
			option
				.setName('message')
				.setDescription(
					'W-W-What message you w-want t-to c-convewt *starts twerking* *screeches*'
				)
				// god what am i doing with my life
				.setRequired(false)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const message = options.getString('message');

		const uwuifier = new Uwuifier({
			spaces: {
				faces: 0.45,
				actions: 0.084,
				stutters: 0.12,
			},
			words: 2,
			exclamations: 1.5,
		});

		const embed = new EmbedBuilder().setColor(0x5fb041);

		embed.setDescription(
			`:cat: | ${uwuifier.uwuifySentence(`${message}`)}`
		);

		await interaction.reply({ embeds: [embed] });
	},
};

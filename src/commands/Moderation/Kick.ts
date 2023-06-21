import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	EmbedBuilder,
} from 'discord.js';
import { client } from '../../Client';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks an user from the guild')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.addUserOption((option) =>
			option
				.setName('member')
				.setDescription('The member to be kicked')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('reason')
				.setDescription('Reason the member will be kicked')
				.setRequired(false)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const user = options.getUser('member');
		let reason = options.getString('reason');

		// Checks to see if any of this values is null
		if (interaction.guildId === null) return;
		if (user === null) return;
		if (reason === null) reason = 'No reason'; // If this one is met, then there's no reason for the kick

		const guild = client.guilds.cache.get(interaction.guildId);
		const guildMember = await guild?.members.fetch(user);

		// This is the embed that will be sent to the user
		const kickEmbed = new EmbedBuilder()
			.setColor(0x5fb041)
			.setTitle('Kicked')
			.setDescription(`You have been kicked from ${interaction.guild}\n`)
			.addFields({
				name: 'Reason',
				value: `${reason}`,
				inline: true,
			});

		guildMember
			?.kick(reason)
			.then(async () => {
				guildMember.send({ embeds: [kickEmbed] }).catch(() => {
					interaction.followUp({
						content:
							'Although the member has been kicked, it failed to send the message to it',
						ephemeral: true,
					});
				});

				await interaction.reply({
					content: `${user.username} has been kicked`,
					ephemeral: true,
				});
			})
			.catch(() => {
				const errorEmbed = new EmbedBuilder()
					.setColor(0xff0000)
					.setDescription('Failed to kick member');

				interaction.reply({
					embeds: [errorEmbed],
					ephemeral: true,
				});

				return;
			});
	},
};

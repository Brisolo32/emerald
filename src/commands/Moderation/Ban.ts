import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	EmbedBuilder,
} from 'discord.js';
import { client } from '../../Client';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans an user from the guild')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.addUserOption((option) =>
			option
				.setName('member')
				.setDescription('The member to be banned')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('reason')
				.setDescription('Reason the member will be banned')
				.setRequired(false)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const user = options.getUser('member');
		let reason = options.getString('reason');

		// Checks to see if any of this values is null
		if (interaction.guildId === null) return;
		if (user === null) return;
		if (reason === null) reason = 'No reason'; // If this one is met, then there's no reason for the ban

		const guild = client.guilds.cache.get(interaction.guildId);
		const guildMember = await guild?.members.fetch(user);

		// This is the embed that will be sent to the user
		const banEmbed = new EmbedBuilder()
			.setColor(0x5fb041)
			.setTitle('Banned')
			.setDescription(`You have been banned from ${interaction.guild}\n`)
			.addFields({
				name: 'Reason',
				value: `${reason}`,
				inline: true,
			});

		guildMember
			?.ban({
				reason: reason,
			})
			.then(async () => {
				guildMember.send({ embeds: [banEmbed] }).catch(() => {
					interaction.followUp({
						content:
							'Although the member has been banned, it failed to send the message to it',
						ephemeral: true,
					});
				});

				await interaction.reply({
					content: `${user.username} has been banned`,
					ephemeral: true,
				});
			})
			.catch(() => {
				const errorEmbed = new EmbedBuilder()
					.setColor(0xff0000)
					.setDescription('Failed to ban member');

				interaction.reply({
					embeds: [errorEmbed],
					ephemeral: true,
				});

				return;
			});
	},
};

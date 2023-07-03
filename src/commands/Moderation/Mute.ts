import {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionsBitField,
	PermissionFlagsBits,
} from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { client } from '../../Client';

export default {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mutes a user')
		.
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('The user that you want to mute')
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName('time')
				.setDescription('The time in minutes for the mute')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option.setName('reason').setDescription('The reason for the mute')
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, member } = interaction;

		const userid = options.getUser('user')?.id;
		const user =  client.members.cache.get(userid)

		const time = interaction.options.getInteger('time');
		const reason = interaction.options.getString('reason') ?? "No reason";
		let duration = time != null ? time * 60000 : 10000;

		const success = new EmbedBuilder().setColor(0x5fb041);

		try {
			if (
				//@ts-ignore
				!member?.permissions.has(
					PermissionsBitField.Flags.ModerateMembers
				)
			) {
				success
					.setTitle('Muted')
					.setDescription('You have been muted')
					.addFields(
						{
							name: 'Reason',
							value: `${reason}`,
						},
						{ name: 'Duration', value: `${time} minutes` },
						{
							name: 'Mod who muted',
							value: `${interaction.member}`,
						}
					);

				if (!user) {
					console.log(user);
					interaction.reply({
						content: "The user isn't in the server",
						ephemeral: true,
					});
				} else {
					// Does the actual job of timing out them
					user
						.timeout(
							duration,
							reason
						)
						.then(() => {
							interaction.reply(
								`${user} has been muted for ${time} minute(s) for ${reason}`
							);

							if (userid != undefined)
								client.users.send(userid, {
									embeds: [success],
								});
						});
				}
			}
		} catch (error) {
			const errorEmbed = new EmbedBuilder()
				.setColor(0xa51818)
				.setTitle('Something went wrong...')
				.setDescription(`${error}`);

			interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}
	},
};

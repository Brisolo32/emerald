import {
	EmbedBuilder,
	PermissionFlagsBits,
	PermissionsBitField,
	SlashCommandBuilder,
} from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { client } from "../../Client";
import { emojis } from "../../Emoji";

export default {
	data: new SlashCommandBuilder()
		.setName("mute")
		.setDescription("Mutes a user")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user that you want to mute")
				.setRequired(true),
		)
		.addIntegerOption((option) =>
			option
				.setName("time")
				.setDescription("The time in minutes for the mute")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option.setName("reason").setDescription("The reason for the mute"),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, member } = interaction;
		const userId = options.getUser("user")?.id;
		if (userId === undefined || member?.user.id === undefined) {
			interaction.reply({
				content: `${emojis.error} | An unknown error occurred.`,
				ephemeral: true,
			});
			return;
		}

		if (interaction.guild === null) {
			interaction.reply({
				content: `${emojis.error} | You need to be in a guild to use this command.`,
				ephemeral: true,
			});
			return;
		}
		const guild = client.guilds.cache.get(interaction.guild.id);
		const user = guild?.members.cache.get(userId);
		const executor = guild?.members.cache.get(member.user.id);

		const time = interaction.options.getInteger("time");
		const reason = interaction.options.getString("reason") ?? "No reason";
		const duration = time != null ? time * 60000 : 10000;

		const embed = new EmbedBuilder().setAuthor({
			name: executor?.user.username ?? "",
			iconURL: executor?.user.avatarURL() ?? "",
		});

		try {
			// Check if user has perms
			if (
				//@ts-ignore
				executor.permissions.has("MODERATE_MEMBERS")
			) {
				// const embed = new EmbedBuilder()
				// 	.setColor(0x5fb041)
				// 	.setTitle("Muted")
				// 	.setDescription("You have been muted")
				// 	.addFields(
				// 		{
				// 			name: "Reason",
				// 			value: `${reason}`,
				// 		},
				// 		{ name: "Duration", value: `${time} minutes` },
				// 		{
				// 			name: "Moderator",
				// 			value: `${interaction.member}`,
				// 		},
				// 	);

				if (!user) {
					embed
						.setTitle("`❗` | Error!")
						.setDescription("The user is not in the server.")
						.setColor(0xaa3333);
					interaction.reply({
						embeds: [embed],
						ephemeral: true,
					});
					return;
				}

				if (user.id === executor?.user.id) {
					embed
						.setTitle("`❗` | Error!")
						.setDescription("You can't mute yourself, silly!")
						.setColor(0xaa3333);
					interaction.reply({
						embeds: [embed],
						ephemeral: true,
					});
					return;
				}

				if (!user.bannable) {
					embed
						.setTitle("`❗` | Error!")
						.setDescription("You can't mute this user.")
						.setColor(0xaa3333);
					interaction.reply({
						embeds: [embed],
						ephemeral: true,
					});
					return;
				}

				// Does the actual job of timing out them
				user.timeout(duration, reason).then(() => {
					embed
						.setTitle("`⏳` | User Timed Out")
						.addFields([
							{
								name: "Target",
								value: `<@${user.user.id}>`,
								inline: true,
							},
							{
								name: "Duration",
								value: `${interaction.options.getInteger("time")} minutes`,
								inline: true,
							},
							{
								name: "Moderator",
								value: `<@${executor?.user.id}>`,
								inline: true,
							},
							{
								name: "Reason",
								value: reason,
								inline: true,
							},
						])
						.setColor(0x33aa33);
					interaction.reply({ embeds: [embed] });

					if (userId !== undefined) {
						const dmEmbed = new EmbedBuilder();
						try {
							dmEmbed
								.setTitle("`⏳` | You've been muted")
								.setDescription(`You've been muted in **${guild?.name}**.`)
								.addFields([
									{
										name: "Duration",
										value: `${interaction.options.getInteger("time")} minutes`,
										inline: true,
									},
									{
										name: "Reason",
										value: reason,
										inline: true,
									},
								])
								.setColor(0xaaaa33);
							client.users.send(userId, {
								embeds: [dmEmbed],
							});
						} catch (error) {
							dmEmbed
								.setTitle("`❗` | Error!")
								.setDescription("Can't DM this user.")
								.setColor(0xaa3333);
							interaction.followUp({ embeds: [dmEmbed] });
						}
					}
				});
			} else {
				embed
					.setTitle("`❗` | Error!")
					.setDescription("You can't use this command.")
					.setColor(0xaa3333);
				interaction.reply({
					embeds: [embed],
					ephemeral: true,
				});
			}
		} catch (error) {
			embed
				.setTitle("`❗` | Error!")
				.setDescription("An unknown error occurred.")
				.setColor(0xaa3333);
			interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
			console.error(error);
		}
	},
};

const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const BlacklistedData = require("..//..//Datastores/Blacklistdata")
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")



module.exports = {
    data: new SlashCommandBuilder()
    .setName("unblacklist")
    .setDescription("Unblacklist a user in the server")
    .addStringOption(option =>
        option
        .setName("userid")
        .setDescription("The ID of the member that you're going to unblacklist")
        .setRequired(true))

    .addStringOption(option =>
        option
        .setName("reason")
        .setDescription("The reason for this unblacklist")
        .setRequired(false)),

        async execute(interaction) {
            if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                try {
                    const GuildId = interaction.guild.id
                    const UserId = interaction.options.getString("userid")
                    const Reason = interaction.options.getString("reason") || "No reason provided."
                    const CommandUser = interaction.user.id;
                    let BlacklistConst = await BlacklistedData.findOne({ GuildId: GuildId, UserId: UserId })
                    let BotBlacklistDataConst = await BotBlacklistedData.findOne({ UserId: CommandUser });

                    if (BotBlacklistDataConst) {
                        const embed3 = new EmbedBuilder()
                        .setDescription("<:bot_no1:1226545118673109093> You are blacklisted from using this bot!")
                        .setColor("Red");
                        interaction.reply({ embeds: [embed3] });
                        return;
                    }

                    if (BlacklistConst) {
                        await BlacklistedData.deleteOne({ GuildId: GuildId, UserId: UserId })
                        const embed = new EmbedBuilder()
                        .setDescription(`<:checkmark1:1225812823267868762> The user <@${UserId}> has been unblacklisted from this guild! || **${Reason}**`)
                        .setColor("Green")

                        interaction.reply({ embeds: [embed] })
                        return;
                    }

                    if (!BlacklistConst) {
                        const BlacklistedEmbed = new EmbedBuilder()
                        .setDescription(`<:bot_no1:1226545118673109093> The user <@${UserId}> is not blacklisted! || **${Reason}**`)
                        .setColor("Red")
                        
                        interaction.reply({ embeds: [BlacklistedEmbed] })
                    }
                } catch (error) {
                    console.log("There was an error:", (error));
                }
            } else {
                const NoPermissionsEmbed = new EmbedBuilder()
                .setDescription(`<:bot_no1:1226545118673109093> You need the Administrator permission to execute this command!`)
                .setColor("Red")

                interaction.reply({ embeds: [NoPermissionsEmbed] })
            }
        }
}
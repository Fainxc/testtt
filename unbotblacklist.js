const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")
const AdminData = require(`..//..//Datastores/AdminsData`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName("botunblacklist")
    .setDescription("Unblacklist a user")
    .addStringOption(option =>
        option
        .setName("userid")
        .setDescription("The ID of the member that you're going to bot unblacklist")
        .setRequired(true))

    .addStringOption(option =>
        option
        .setName("reason")
        .setDescription("The reason for this bot unblacklist")
        .setRequired(false)),

        async execute(interaction) {
            let AdminDataConst = await AdminData.findOne({ AdminIds: interaction.user.id })
            if (AdminDataConst) { 
                    try {
                    const UserId = interaction.options.getString("userid")
                    const Reason = interaction.options.getString("reason") || "No reason provided."
                    const CommandUser = interaction.user.id;
                    let BlacklistConst = await BotBlacklistedData.findOne({ UserId: UserId })

                    if (BlacklistConst) {
                        await BotBlacklistedData.deleteOne({ UserId: UserId })
                        const embed = new EmbedBuilder()
                        .setDescription(`<:checkmark1:1225812823267868762> The user <@${UserId}> has been unblacklisted from this bot! || **${Reason}**`)
                        .setColor("Green")

                        interaction.reply({ embeds: [embed] })
                        return;
                    }

                    if (!BlacklistConst) {
                        const BlacklistedEmbed = new EmbedBuilder()
                        .setDescription(`<:bot_no1:1226545118673109093> The user <@${UserId}> is not bot blacklisted! || **${Reason}**`)
                        .setColor("Red")
                        
                        interaction.reply({ embeds: [BlacklistedEmbed] })
                    }
                } catch (error) {
                    console.log("There was an error:", (error));
                }
            } else {
                const NoPermissionsEmbed = new EmbedBuilder()
                .setDescription(`<:bot_no1:1226545118673109093> Only the Bot Administrators can execute this command!`)
                .setColor("Red")

                interaction.reply({ embeds: [NoPermissionsEmbed] })
            }
        }
}
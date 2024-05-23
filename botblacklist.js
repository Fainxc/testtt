const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")
const AdminData = require(`..//..//Datastores/AdminsData`)


module.exports = {
    data: new SlashCommandBuilder()
    .setName("botblacklist")
    .setDescription("Blacklist a user from using this bot")
    .addStringOption(option =>
        option
        .setName("userid")
        .setDescription("The ID of the user that you're going to bot blacklist")
        .setRequired(true))

    .addStringOption(option =>
        option
        .setName("reason")
        .setDescription("The reason for this bot blacklist")
        .setRequired(false)),

        async execute(interaction) {
            let AdminDataConst = await AdminData.findOne({ AdminIds: interaction.user.id })
            if (AdminDataConst) { 
            try {
                    const UserId = interaction.options.getString("userid")
                    const Reason = interaction.options.getString("reason") || ("No reason provided.")
                    let BlacklistConst = await BotBlacklistedData.findOne({ UserId: UserId })

                    if (UserId === "1204026430749409280") {
                        interaction.reply("You can not blacklist the bot!")
                        return;
                    }

                    if (BlacklistConst) {
                        const embed = new EmbedBuilder()
                        .setDescription(`<:bot_no1:1226545118673109093> The user <@${UserId}> is already blacklisted from using this bot! || **${BlacklistConst.Reason}**`)
                        .setColor("Red")

                        interaction.reply({ embeds: [embed] })
                        return;
                    }

                    if (!BlacklistConst) {
                        BlacklistConst =  new BotBlacklistedData({ UserId: UserId, Reason: Reason })
                        await BlacklistConst.save()
                        const BlacklistedEmbed = new EmbedBuilder()
                        .setDescription(`<:checkmark1:1225812823267868762> The user <@${UserId}> has been blacklisted from using this bot permanently! || **${Reason}**`)
                        .setColor("Green")
                        
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
const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const BlacklistedData = require("..//..//Datastores/Blacklistdata")
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")
const AdminData = require(`..//..//Datastores/AdminsData`)



module.exports = {
    data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("Blacklist a member in the server")
    .addStringOption(option =>
        option
        .setName("userid")
        .setDescription("The ID of the member that you're going to blacklist")
        .setRequired(true))

    .addStringOption(option =>
        option
        .setName("reason")
        .setDescription("The reason for this blacklist")
        .setRequired(false)),

        async execute(interaction) {
            let AdminDataConst = await AdminData.findOne({ AdminIds: interaction.user.id })
            if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) || (AdminDataConst && AdminDataConst.AdminIds)) {
                try {
                    const GuildId = interaction.guild.id
                    const UserId = interaction.options.getString("userid")
                    const Reason = interaction.options.getString("reason") || "No reason provided."
                    let BlacklistConst = await BlacklistedData.findOne({ GuildId: GuildId, UserId: UserId })
                    const CommandUser = interaction.user.id;
                    let BotBlacklistDataConst = await BotBlacklistedData.findOne({ UserId: CommandUser });

                    if (BotBlacklistDataConst) {
                        const embed3 = new EmbedBuilder()
                        .setDescription("<:bot_no1:1226545118673109093> You are blacklisted from using this bot!")
                        .setColor("Red");
                        interaction.reply({ embeds: [embed3] });
                        return;
                    }

                    let TargetAdminDataConst = await AdminData.findOne({ AdminIds: UserId })

                    if (TargetAdminDataConst) {
                        const embed4 = new EmbedBuilder()
                        .setDescription(`<:bot_no1:1226545118673109093> You cannot blacklist a Cypher Staff!`)
                        .setColor("Red");
                        interaction.reply({ embeds: [embed4] });
                        return;
                    }

                    if (BlacklistConst) {
                        const embed = new EmbedBuilder()
                        .setDescription(`The user <@${UserId}> is already blacklisted from this guild! || **${BlacklistConst.Reason}**`)
                        .setColor("Red")

                        interaction.reply({ embeds: [embed] })
                        return;
                    }

                    if (!BlacklistConst) {
                        BlacklistConst =  new BlacklistedData({ GuildId: GuildId, UserId: UserId, Reason: Reason })
                        await BlacklistConst.save()
                        const BlacklistedEmbed = new EmbedBuilder()
                        .setDescription(`<:checkmark1:1225812823267868762> The user <@${UserId}> has been blacklisted from this guild! || **${Reason}**`)
                        .setColor("Green")
                        
                        interaction.reply({ embeds: [BlacklistedEmbed] })
                    }
                } catch (error) {
                    console.log("There was an error:", (error));
                }
            } else {
                const NoPermissionsEmbed = new EmbedBuilder()
                .setDescription("<:bot_no1:1226545118673109093> You need the Manage Roles permission to execute this command!")
                .setColor("Red")

                interaction.reply({ embeds: [NoPermissionsEmbed] })
            }
        }
}
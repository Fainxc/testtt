const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const unban = require("./unban");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")
const AdminData = require(`..//..//Datastores/AdminsData`)


module.exports = {
    data: new SlashCommandBuilder()
    .setName("idban")
    .setDescription("Ban someone from the server with their ID")
    .addStringOption(option =>
        option
        .setName("targetid")
        .setDescription("The ID of the user you want to ban")
        .setRequired(true))
    .addStringOption(option =>
        option
        .setName("reason")
        .setDescription("The reason for this unban")),

        async execute(interaction) {
            try {
                const CommandUser = interaction.user.id;
                let BotBlacklistDataConst = await BotBlacklistedData.findOne({ UserId: CommandUser });

                if (BotBlacklistDataConst) {
                    const embed3 = new EmbedBuilder()
                    .setDescription("<:bot_no1:1226545118673109093> You are blacklisted from using this bot!")
                    .setColor("Red");
                    interaction.reply({ embeds: [embed3] });
                    return;
                }
        if (interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            const TargetId = interaction.options.getString("targetid")
            const BanReason = interaction.options.getString("reason") || "No reason provided."
            let TargetAdminDataConst = await AdminData.findOne({ AdminIds: TargetId })

            if (TargetAdminDataConst) {
                const embed4 = new EmbedBuilder()
                .setDescription(`<:bot_no1:1226545118673109093> You cannot ban a Cypher Staff!`)
                .setColor("Red");
                interaction.reply({ embeds: [embed4] });
                return;
            }
            const embed = new EmbedBuilder()
            .setDescription(`<:checkmark1:1225812823267868762> This user has been banned for the reason ${BanReason}`)
            .setColor("Green")
            await interaction.guild.bans.create(TargetId, {reason: BanReason}).catch(error => console.log(error))
            interaction.reply({ embeds: [embed] })
        }
            } catch (error) {
                await interaction.reply({ content: `There was an error executing this command!`, ephemeral: true })
            }
        }
}
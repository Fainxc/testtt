const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")
const AdminData = require(`..//..//Datastores/AdminsData`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user from the server")
    .addStringOption(option => 
        option
        .setName("userid")
        .setDescription("The user you want to unban")
        .setRequired(true))
    .addStringOption(option => 
        option
        .setName("reason")
        .setDescription("The reason for this action")
        .setRequired(false)),

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
        const target = interaction.options.getString("userid")
        const Banlist = await interaction.guild.bans.fetch();
        const bannedtarget = Banlist.get(target)
        let AdminDataConst = await AdminData.findOne({ AdminIds: interaction.user.id })

        if (interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers) && bannedtarget || (AdminDataConst && AdminDataConst.AdminIds)  ) {
            const reason = interaction.options.getString("reason") || "No reason provided."
            interaction.guild.members.unban(target, {reason})
            const embed = new EmbedBuilder()
            .setDescription(`<:checkmark1:1225812823267868762> Successfully unbanned <@${target}> for the reason: **${reason}**`)
            .setColor("Green")
            interaction.reply({ embeds: [embed] })
        } else {
            const Failembed = new EmbedBuilder()
            .setDescription(`<:bot_no1:1226545118673109093> This user is not banned!`)
            .setColor("Red")
            interaction.reply({ embeds: [Failembed] })
        }
            } catch (error) {
                interaction.reply({ content: `There was an error executing this command, error: ${error}`, ephemeral: true })
            }
        }
}
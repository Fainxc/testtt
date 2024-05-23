const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")
const AdminData = require(`..//..//Datastores/AdminsData`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the server")
    .addUserOption(option => 
        option
        .setName("target")
        .setDescription("The user you want to kick from the server")
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
        if (interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            const target = interaction.options.getUser("target")
            let TargetAdminDataConst = await AdminData.findOne({ AdminIds: target.id })

            if (TargetAdminDataConst) {
                const embed4 = new EmbedBuilder()
                .setDescription(`<:bot_no1:1226545118673109093> You cannot kick a Cypher Staff!`)
                .setColor("Red");
                interaction.reply({ embeds: [embed4] });
                return;
            }

            if (interaction.user.id === target.id) {
                const BanYourSelfError = new EmbedBuilder()
                .setDescription("<:bot_no1:1226545118673109093> You can not kick yourself!")
                .setColor("Red")
                interaction.reply({ embeds: [BanYourSelfError] })
                return;
            }

            const Bot = interaction.guild.members.resolve(interaction.client.user.id)
            const targetkick = interaction.guild.members.resolve(target)

            if (Bot.roles.highest.position <= targetkick.roles.highest.position) {
                const BanHRError1 = new EmbedBuilder()
                .setDescription("<:bot_no1:1226545118673109093> I can not ban someone higher or equal to me!")
                .setColor("Red")
                interaction.reply({ embeds: [BanHRError1] })
                return;
            }

            const reason = interaction.options.getString("reason") || "No reason provided."

            if (interaction.member.roles.highest.position < targetkick.roles.highest.position) {
                const KickHRError = new EmbedBuilder()
                .setDescription("<:bot_no1:1226545118673109093> You can not kick someone higher than you!")
                .setColor("Red")
                interaction.reply({ embeds: [KickHRError] })
                return;
            }
            
            const SuccessEmbed = new EmbedBuilder()
            .setDescription(`<:checkmark1:1225812823267868762> Successfully kicked ${target} for the reason: ${reason}`)
            .setColor("Green")
            await targetkick.kick(reason).catch(error => console.log(error))
            await interaction.reply({ embeds: [SuccessEmbed] })
        } else {
            const ErrorEmbed = new EmbedBuilder()
            .setDescription("<:bot_no1:1226545118673109093> You need the Kick Members permission to execute this command!")
            .setColor("Red")
            await interaction.reply({ embeds: [ErrorEmbed] })
        }
            } catch (error) {
                await interaction.reply({ content: `There was an error executing this command!`, ephemeral: true })
                console.log(error)
            }
        }
}
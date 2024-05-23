const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, Guild } = require("discord.js")
const ReportData = require(".//..//..//Datastores/ReportData")
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")


module.exports = {
    data: new SlashCommandBuilder()
    .setName("setupreport")
    .setDescription("Setup the report system for your server")
    .addStringOption(option => 
        option
        .setName("channelid")
        .setDescription("The ID of the channel where the reports will be sent to")
        .setRequired(true)),

        async execute(interaction) {
            try {
                const CommandUser = interaction.user.id
                let BotBlacklistDataConst = await BotBlacklistedData.findOne({ UserId: CommandUser });

                if (BotBlacklistDataConst) {
                    const embed3 = new EmbedBuilder()
                    .setDescription("<:bot_no1:1226545118673109093> You are blacklisted from using this bot!")
                    .setColor("Red");
                    interaction.reply({ embeds: [embed3] });
                    return;
                }
                if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    const ChannelStringId = interaction.options.getString("channelid")
                    let ReportDataConst = await ReportData.findOne({ GuildId: interaction.guild.id })
                    const ValidChannelGuild = await interaction.guild.channels.fetch(ChannelStringId)
    
    
                    if (ReportDataConst) {
                      await ReportData.updateOne({ GuildId: interaction.guild.id, ChannelId: ChannelStringId })
                      await ReportDataConst.save()
                        const AlreadyEmbed = new EmbedBuilder()
                        .setDescription(`<:checkmark1:1225812823267868762> Successfully changed the channel id to: **${ChannelStringId}** `)
                        .setColor("Green")
                        interaction.reply({ embeds: [AlreadyEmbed] })
                    }
                    if (!ReportDataConst) {
                        ReportDataConst = new ReportData({ ChannelId: ChannelStringId, GuildId: interaction.guild.id })
                        await ReportDataConst.save()
    
                        const embed2 = new EmbedBuilder()
                        .setDescription(`<:checkmark1:1225812823267868762> Successfully set the assigned channel to: **${ChannelStringId}**`)
                        .setColor("Green")
                        interaction.reply({ embeds: [embed2] })
                    }
    
                } else {
                    const ErrorEmbed = new EmbedBuilder()
                    .setDescription(`<:bot_no1:1226545118673109093> You need the Administrator permission to execute this command!`)
                    .setColor("Red")
                    interaction.reply({ embeds: [ErrorEmbed] })
                }
            } catch (error) {
                interaction.reply({ content: `There was an error executing this command, error: ${error}`, ephemeral: true })
                console.log(error)
            }
        }
        
}
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const ReportData = require(".//..//..//Datastores/ReportData");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Report a member")
        .addUserOption(option => 
        option
    .setName("member")
.setDescription("The member you are reporting")
.setRequired(true))

        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("The reason for this report")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("evidence")
                .setDescription("Provide a message link and/or a screenshot that can be viewed through a link")
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
    
            let ReportDataConst = await ReportData.findOne({ GuildId: interaction.guild.id });
            if (!ReportDataConst) {
                const NoDataEmbed = new EmbedBuilder()
                    .setDescription(`<:bot_no1:1226545118673109093> You do not have an assigned channel for this report to be sent to! Use the /setupreport slash command!`)
                    .setColor("Red");
                return interaction.reply({ embeds: [NoDataEmbed] });
            }

            const MemberTarget = interaction.options.getUser("member")
            const Reason = interaction.options.getString("reason");
            const Evidence = interaction.options.getString("evidence");
    
            const Accept = new ButtonBuilder()
                .setCustomId("moderated")
                .setLabel("Moderated")
                .setStyle(ButtonStyle.Success);
    
            const Reject = new ButtonBuilder()
                .setCustomId("reject")
                .setLabel("Reject Report")
                .setStyle(ButtonStyle.Danger);
    
            const row = new ActionRowBuilder().addComponents(Accept, Reject);
    
            const ChannelToSend = interaction.client.channels.cache.get(ReportDataConst.ChannelId);
            if (!ChannelToSend) {
                const ErrorEmbed1 = new EmbedBuilder()
                    .setDescription(`<:bot_no1:1226545118673109093> No channel found with the ID ${ReportDataConst.ChannelId}!`)
                    .setColor("Red");
                return interaction.reply({ embeds: [ErrorEmbed1] });
            }
    
            const SentEmbed = new EmbedBuilder()
                .setTitle("**Report**")
                .setDescription(`Reported by: <@${interaction.user.id}>`)
                .addFields(
                    { name: `Member`, value: `${MemberTarget}` },
                    { name: `Reason`, value: `${Reason}` },
                    { name: `Evidence`, value: `${Evidence}` }
                )
                .setColor("Red");
    
            const message = await ChannelToSend.send({ embeds: [SentEmbed], components: [row] });
    
            const Collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000_000 });
    
            Collector.on("collect", async (i) => {
                if (i.customId === "moderated") {
                    const Target = interaction.user
                    const TargetId = interaction.user.username
                    const TargetAvatar = interaction.user.displayAvatarURL()
                    const DmEmbed = new EmbedBuilder()
                    .setTitle("**Report Status**")
                    .setFields(
                        { name: `Message`, value: `<:checkmark1:1225812823267868762> <@${MemberTarget.id}> has been moderated.` }
                    )
                    .setColor("Green")
                    await Target.send({ embeds: [DmEmbed] }).catch(error => console.log(error))
                    const AcceptedEmbed = new EmbedBuilder()
                    .setColor("Green")
                        .setTitle("**Report Status**")
                        .addFields(
                            { name: `Requested By`, value: `<@${interaction.user.id}>` },
                            { name: `Moderated By`, value: `<@${i.user.id}>` }
                        )
                        .setFooter(
                            { text: `${TargetId} has been notified that the member has been moderated!`, iconURL: (TargetAvatar) }
                        )
                    await interaction.client.channels.cache.get(ReportDataConst.ChannelId).send({ embeds: [AcceptedEmbed] });
                }
    
                if (i.customId === "reject") {
                    const Target = interaction.user
                    const TargetId = interaction.user.username
                    const TargetAvatar = interaction.user.displayAvatarURL()
                    const DmEmbed = new EmbedBuilder()
                    .setTitle("**Report Status**")
                    .setFields(
                        { name: `Message`, value: `<:bot_no1:1226545118673109093> Declined, <@${MemberTarget.id}> has not been moderated.` }
                    )
                    .setColor("Red")
                    await Target.send({ embeds: [DmEmbed] }).catch(error => console.log(error))
                    const AcceptedEmbed = new EmbedBuilder()
                    .setColor("Red")
                        .setTitle("**Report Status**")
                        .addFields(
                            { name: `Requested By`, value: `<@${interaction.user.id}>` },
                            { name: `Declined By`, value: `<@${i.user.id}>` }
                        )
                        .setFooter(
                            { text: `${TargetId} has been notified that their report has been declined`, iconURL: (TargetAvatar) }
                        )
                    await interaction.client.channels.cache.get(ReportDataConst.ChannelId).send({ embeds: [AcceptedEmbed] });
                }
            });
    
            const SentEmbed1 = new EmbedBuilder()
                .setDescription(`<:checkmark1:1225812823267868762> Successfully reported! You will be messaged by me if they have been moderated or not later on!`)
                .setColor("Green");
            return interaction.reply({ embeds: [SentEmbed1] });
        } catch (error) {
            await interaction.reply({ content: `There was an error executing this command!`, ephemeral: true })
            console.log(error)
        }
    }

};

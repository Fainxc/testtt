const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const InactiveData = require(".//..//..//Datastores/InactiveData");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inactivenotice")
        .setDescription("Request an inactive notice")
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("The reason for this inactive notice request")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("duration")
                .setDescription("The requested duration of this inactive notice")
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
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
                const ErrorEmbed = new EmbedBuilder()
                    .setDescription(`<:bot_no1:1226545118673109093> You need the Manage Nicknames permission to execute this command!`)
                    .setColor("Red");
                return interaction.reply({ embeds: [ErrorEmbed] });
            }
    
            let InactiveDataConst = await InactiveData.findOne({ GuildId: interaction.guild.id });
            if (!InactiveDataConst) {
                const NoDataEmbed = new EmbedBuilder()
                    .setDescription(`<:bot_no1:1226545118673109093> You do not have an assigned channel for this request to be sent to! Use the /setupin slash command!`)
                    .setColor("Red");
                return interaction.reply({ embeds: [NoDataEmbed] });
            }
    
            const Reason = interaction.options.getString("reason");
            const Duration = interaction.options.getString("duration");
    
            const Accept = new ButtonBuilder()
                .setCustomId("accept")
                .setLabel("Accept")
                .setStyle(ButtonStyle.Success);
    
            const Reject = new ButtonBuilder()
                .setCustomId("reject")
                .setLabel("Decline")
                .setStyle(ButtonStyle.Danger);
    
            const row = new ActionRowBuilder().addComponents(Accept, Reject);
    
            const ChannelToSend = interaction.client.channels.cache.get(InactiveDataConst.ChannelId);
            if (!ChannelToSend) {
                const ErrorEmbed1 = new EmbedBuilder()
                    .setDescription(`<:bot_no1:1226545118673109093> No channel found with the ID ${InactiveDataConst.ChannelId}!`)
                    .setColor("Red");
                return interaction.reply({ embeds: [ErrorEmbed1] });
            }
    
            const SentEmbed = new EmbedBuilder()
                .setTitle("**Inactive Notice Request**")
                .setDescription(`Requested by: <@${interaction.user.id}>`)
                .addFields(
                    { name: `Reason`, value: `${Reason}` },
                    { name: `Duration`, value: `${Duration}` }
                )
                .setColor("Blue");
    
            const message = await ChannelToSend.send({ embeds: [SentEmbed], components: [row] });
    
            const Collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000_000 });
    
            Collector.on("collect", async (i) => {
                if (i.customId === "accept") {
                    const Target = interaction.user
                    const TargetId = interaction.user.username
                    const TargetAvatar = interaction.user.displayAvatarURL()
                    const DmEmbed = new EmbedBuilder()
                    .setTitle("**Inactive Notice Status**")
                    .setFields(
                        { name: `Status`, value: `<:checkmark1:1225812823267868762> Accepted` }
                    )
                    .setColor("Green")
                    await Target.send({ embeds: [DmEmbed] }).catch(error => console.log(error))
                    const AcceptedEmbed = new EmbedBuilder()
                    .setColor("Green")
                        .setTitle("**Inactive Notice Status**")
                        .addFields(
                            { name: `Requested By`, value: `<@${interaction.user.id}>` },
                            { name: `Accepted By`, value: `<@${i.user.id}>` }
                        )
                        .setFooter(
                            { text: `${TargetId} has been messaged`, iconURL: (TargetAvatar) }
                        )
                    await interaction.client.channels.cache.get(InactiveDataConst.ChannelId).send({ embeds: [AcceptedEmbed] });
                }
    
                if (i.customId === "reject") {
                    const Target = interaction.user
                    const TargetId = interaction.user.username
                    const TargetAvatar = interaction.user.displayAvatarURL()
                    const DmEmbed = new EmbedBuilder()
                    .setTitle("**Inactive Notice Status**")
                    .setFields(
                        { name: `Status`, value: `<:bot_no1:1226545118673109093> Declined` }
                    )
                    .setColor("Red")
                    await Target.send({ embeds: [DmEmbed] }).catch(error => console.log(error))
                    const AcceptedEmbed = new EmbedBuilder()
                    .setColor("Red")
                        .setTitle("**Inactive Notice Status**")
                        .addFields(
                            { name: `Requested By`, value: `<@${interaction.user.id}>` },
                            { name: `Declined By`, value: `<@${i.user.id}>` }
                        )
                        .setFooter(
                            { text: `${TargetId} has been messaged`, iconURL: (TargetAvatar) }
                        )
                    await interaction.client.channels.cache.get(InactiveDataConst.ChannelId).send({ embeds: [AcceptedEmbed] });
                }
            });
    
            const SentEmbed1 = new EmbedBuilder()
                .setDescription(`<:checkmark1:1225812823267868762> Successfully requested an inactive notice! You will be messaged by me when it has been accepted/rejected by one of your high ranks!`)
                .setColor("Green");
            return interaction.reply({ embeds: [SentEmbed1] });
        } catch (error) {
            await interaction.reply({ content: `There was an error executing this command!`, ephemeral: true })
        }
    }

};

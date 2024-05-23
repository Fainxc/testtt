const { SlashCommandBuilder, ActivityType, EmbedBuilder, PermissionsBitField, } = require("discord.js");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("active")
    .setDescription("Indicate the duration of your moderation activity by specifying the start and end dates!")
    .addStringOption(option =>
        option
        .setName("start")
        .setDescription("Set the start time, e.g 3:00PM EST")
        .setRequired(true))

        .addStringOption(option =>
            option
            .setName("end")
            .setDescription("The end date, e.g 4:00PM EST")
            .setRequired(true))

            .addStringOption(option =>
                option
                .setName("timespent")
                .setDescription("The total amount spent on-duty")
                .setRequired(false)),

        async execute(interaction) {
            try {
                if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
                    const CommandUser = interaction.user.id;
                    let BotBlacklistDataConst = await BotBlacklistedData.findOne({ UserId: CommandUser });

                    if (BotBlacklistDataConst) {
                        const embed3 = new EmbedBuilder()
                        .setDescription("<:bot_no1:1226545118673109093> You are blacklisted from using this bot!")
                        .setColor("Red");
                        interaction.reply({ embeds: [embed3] });
                        return;
                    }
                    const Start = interaction.options.getString("start")
                    const End = interaction.options.getString("end")
                    const TimeSpent = interaction.options.getString("timespent") || "Timespent was not provided."
                    const SuccessEmbed = new EmbedBuilder()
                    .setAuthor(
                        { name: `Activity Data || ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() }
                    )
                    .setDescription(`Activity Board`)
                    .addFields(
                        { name: `Start Date`, value: `${Start}` },
                        { name: `End Date`, value: `${End}`, inline: true },
                        { name: `Total Time Spent`, value: `${TimeSpent}`, inline: true }
                    )
                    .setColor("Blue")
                    interaction.reply({ embeds: [SuccessEmbed] })
                } else {
                    const NoPermissionEmbed = new EmbedBuilder()
                    .setDescription(`<:bot_no1:1226545118673109093> You need the **Manage Nicknames** permission to execute this command!`)
                    .setColor("Red")
                    interaction.reply({ embeds: [NoPermissionEmbed] })
                }
            } catch (error) {
                interaction.reply({ content: `There was an error executing this command, error: ${error}`, ephemeral: true })
                console.log(error)
            }
        }
}
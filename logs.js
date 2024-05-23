const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const BotBlacklistedData = require("../../Datastores/BotblacklistData")
const QuotaData = require("../../Datastores/QuotaData")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Fetch logs for a user")
    .addUserOption(option => 
        option
        .setName("user")
        .setDescription("The user whose logs you want to fetch")
        .setRequired(true)),

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

            if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
                const target = interaction.options.getUser("user");
                let QuotaDataConst = await QuotaData.findOne({ GuildId: interaction.guild.id, UserId: target.id })

                if (!QuotaDataConst) {
                    const embed4 = new EmbedBuilder()
                    .setDescription(`<:bot_no1:1226545118673109093> No logs found for user: ${target.username}`)
                    .setColor("Red");
                    interaction.reply({ embeds: [embed4] });
                    return;
                }

                const embed = new EmbedBuilder()
                .setAuthor(
                    { name: "Support Server", iconURL: `https://th.bing.com/th/id/OIG2.s0pOBV.v7Prnc1qV2JsI?w=1024&h=1024&rs=1&pid=ImgDetMain`, url: `https://discord.gg/yGDS9RJ52N` }
                ) 
                .setTitle(`Logs for ${target.username}`)
                .setColor("Purple")
                .addFields(
                    {name: "Username", value: `${target.username}`, inline: false},
                    {name: "Total Logs", value: `${QuotaDataConst.Logs}`, inline: true},
                )
                .setFooter({ text: `Fetched by: ${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})

                interaction.reply({ embeds: [embed] })
            }
        } catch (error) {
            interaction.reply({ content: `There was an error executing this command, error: ${error}`, ephemeral: true })
            console.log(error)
        }
    }
}

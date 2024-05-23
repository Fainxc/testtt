const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")


module.exports = {
    data: new SlashCommandBuilder()
    .setName("result")
    .setDescription("Creates an application result embed")
    .addUserOption(option => 
        option
        .setName("user")
        .setDescription("The user you failed/passed")
        .setRequired(true))

    .addStringOption(option => 
        option
        .setName("result")
        .setDescription("The result of their application")
        .addChoices(
            { name: "Passed", value: "Passed" },
            { name: "Failed", value: "Failed" }
        )
        .setRequired(true))

        .addStringOption(option => 
            option
            .setName("type")
            .setDescription("The position they applied for. E.g 'Discord Moderator', 'Administrator', etc.")
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
        if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            const target = interaction.options.getUser("user")
            const result = interaction.options.getString("result")
            const reason = interaction.options.getString("reason") || "No reason provided.";
            const type = interaction.options.getString("type")
            const CommandUserAvatar = interaction.user.displayAvatarURL()
            const embed = new EmbedBuilder()
            .setAuthor(
                { name: "Support Server", iconURL: `https://th.bing.com/th/id/OIG2.s0pOBV.v7Prnc1qV2JsI?w=1024&h=1024&rs=1&pid=ImgDetMain`, url: `https://discord.gg/yGDS9RJ52N` }
            )
            .setTitle(target.username)
            .setDescription(`Application Result for ${type}`)
            .setColor("Blue")
            .addFields(
                {name: "Result", value: `${result}`},
                {name: "Reason", value: `${reason}`},
                )
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${CommandUserAvatar}` })

            interaction.reply({ embeds: [embed] })
        }
            } catch (error) {
                interaction.reply({ content: `There was an error executing this command, error: ${error}`, ephemeral: true })
            }
        }
}
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")


module.exports = {
    data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Creates a staff update embed")
    .addUserOption(option => 
        option
        .setName("target")
        .setDescription("The user you took this action on")
        .setRequired(true))

    .addRoleOption(option => 
        option
        .setName("oldrole")
        .setDescription("The role they had before this action")
        .setRequired(true))

    .addRoleOption(option => 
        option
        .setName("newrole")
        .setDescription("The role they just received. e.g `Former Staff` ")
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
            const target = interaction.options.getUser("target")
            const reason = interaction.options.getString("reason") || "No reason provided."
            const oldrole = interaction.options.getRole("oldrole")
            const newrole = interaction.options.getRole("newrole")
            const embed = new EmbedBuilder()
            .setTitle(target.username)
            .setURL("https://www.roblox.com/groups/9236527/social-fashion-clothing#!/about")
            .setDescription("Rank Updated")
            .setColor("Blue")
            .addFields(
                {name: "Reason", value: reason, inline: false}   ,             
                {name: "Old Rank", value: `<@&${oldrole.id}>`, inline: true},
                {name: "New Rank", value: `<@&${newrole.id}>`, inline: true},
                )
            .setThumbnail("https://cdn-icons-png.flaticon.com/512/3168/3168107.png")
            .setFooter({ text: `Updated by: ${interaction.user.username}` })

            interaction.reply({ embeds: [embed] })
        }
            } catch (error) {
                interaction.reply({ content: `There was an error executing this command, error: ${error}`, ephemeral: true })
            }
        }
}
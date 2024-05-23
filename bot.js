const { SlashCommandBuilder, ActivityType, EmbedBuilder, PermissionsBitField, } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
    .setName("botstatus")
    .setDescription("Change the Bot's status!")
    .addStringOption(option =>
        option
        .setName("newstatus")
        .setDescription("Set the new status for the bot")
        .setRequired(true)),

        async execute(interaction) {
            if (interaction.user.id === "692337681576755261") {
                const newstatus = interaction.options.getString("newstatus")
                await interaction.client.user.setPresence({ activities: [{ name: newstatus, type: 3 }], status: "online" })
                const SuccessEmbed = new EmbedBuilder()
                .setDescription(`<:checkmark1:1225812823267868762> Successfully set the new status to: ${newstatus}!`)
                .setColor("Green")
                interaction.reply({ embeds: [SuccessEmbed] })
            } else {
                const embed = new EmbedBuilder()
                .setDescription(`<:bot_no1:1226545118673109093> Only the Bot Owner can execute this command!`)
                .setColor("Red")
                interaction.reply({ embeds: [embed] })
            }
        }
}
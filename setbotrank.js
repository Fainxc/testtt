const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const AdminData = require(`../../Datastores/AdminsData`)


module.exports = {
    data: new SlashCommandBuilder()
    .setName("setbotrank")
    .setDescription("Add an Administrator to the Cypher Staff Team, user ID")
    .addStringOption(option =>
        option
        .setName("userid")
        .setDescription("The ID of the user you want to add as an Administrator")
        .setRequired(true)),



        async execute(interaction) {
            const CommandUserId = interaction.user.id
            const BotOwner = "692337681576755261"
            const newAdminId = interaction.options.getString("userid")
            let AdminDataConst = await AdminData.findOne({ AdminIds: newAdminId })

            if (interaction.user.id !== BotOwner) {
                const FailEmbed = new EmbedBuilder()
                .setDescription("<:bot_no1:1226545118673109093> Only the bot owner can execute this command!")
                .setColor("Red")
                interaction.reply({ embeds: [FailEmbed], ephemeral: true })
                return;
            }

            if (!AdminDataConst) {
            AdminDataConst = new AdminData({ AdminIds: newAdminId })
            await AdminDataConst.save()
            const embed = new EmbedBuilder()
            .setDescription(`<:checkmark1:1225812823267868762> <@${newAdminId}> has successfully been set as an Administrator for Cypher!`)
            .setColor("Green")

            interaction.reply({ embeds: [embed] })

            } else {
                const FailEmbed2 = new EmbedBuilder()
                .setDescription("<:bot_no1:1226545118673109093> This user is already a Cypher Administrator!")
                .setColor("Red")
                interaction.reply({ embeds: [FailEmbed2] })
            }

        }
}
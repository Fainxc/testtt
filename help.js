const { SlashCommandBuilder, ActivityType, EmbedBuilder, PermissionsBitField, } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays a help embed"),

        async execute(interaction) {
            try {
                    const Bot = interaction.client
                    const BotAvatar = Bot.user.displayAvatarURL()
                    const SuccessEmbed = new EmbedBuilder()
                    .setTitle("**SUPPORT SERVER**")
                    .setDescription(`You can join our Support Server for assistance!\nDiscord: https://discord.gg/xW9vHCbzHu`)
                    .setColor("Blue")
                    .setTimestamp()
                    .setThumbnail(BotAvatar)
                    interaction.reply({ embeds: [SuccessEmbed] })
        
                
            } catch (error) {
                interaction.reply({ content: `There was an error executing this command, error: ${error}`, ephemeral: true })
                console.log(error)
            }
        }
}
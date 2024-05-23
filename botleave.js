const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")


module.exports = {
    data: new SlashCommandBuilder()
    .setName("botleave")
    .setDescription("Owner only, leave a guild.")
    .addStringOption(option =>
    option
.setName("guildid")
.setDescription("Leave the guild with the provided ID")
.setRequired(true)),

async execute(interaction) {
    try {
        if (interaction.user.id === "692337681576755261") {
            const guildid = interaction.options.getString("guildid")
            const IsinGuild = interaction.client.guilds.cache.get(guildid)
    
            if (IsinGuild) {
                IsinGuild.leave()
                const embed1 = new EmbedBuilder()
                .setDescription(`I left the server with the id: **${guildid}**!`)
                .setColor("Red")
                interaction.reply({ embeds: [embed1] })
            }
        } else {
            const embed2 = new EmbedBuilder()
                .setDescription(`You are not allowed to use this command, Bot Administrators only!`)
                .setColor("Red")
                interaction.reply({ embeds: [embed2] })
            interaction.reply("You are not allowed to use this command!")
        }
    } catch (error) {
        console.log(error)
    }
}

}
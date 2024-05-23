const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("guildinfo")
    .setDescription("Owner only, retrieve info from a guild.")

    .addStringOption(option =>
    option
.setName("guildid")
.setDescription("The ID of the guild")
.setRequired(true)),

async execute(interaction) {
    try {
        if (interaction.user.id === "692337681576755261") {
            const guildid = interaction.options.getString("guildid")
            const IsinGuild = interaction.client.guilds.cache.get(guildid)
            if (IsinGuild) {
                const ownerId = IsinGuild.ownerId
                const OwnerUser = await interaction.client.users.fetch(ownerId)
                const GuildIcon = IsinGuild.iconURL()
                const embed = new EmbedBuilder()
                .setTitle("**Guild Data**")
                .setDescription(`**Id:** ${guildid}\n**Name:** ${IsinGuild.name}\n**OwnerId:** ${ownerId}\n**OwnerUser:** ${OwnerUser.tag}`)
                .setColor("Blue")
                .setThumbnail(GuildIcon)
                interaction.reply({ embeds: [embed] })
            } else {
                const embed1 = new EmbedBuilder()
                .setDescription(`I am not in a server with the id: **${guildid}**!`)
                .setColor("Red")
                interaction.reply({ embeds: [embed1] })
            }
        } else {
            const embed2 = new EmbedBuilder()
            .setDescription(`You are not allowed to use this command, Bot Administrators only!`)
            .setColor("Red")
            interaction.reply({ embeds: [embed2] })
        }
    } catch (error) {
        console.log(error)
    }
}
}
const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Bot owner only, check your bot's information, e.g how many guilds it's in."),

    async execute(interaction) {
        try {
            if (interaction.user.id !== "692337681576755261") return await interaction.reply({ content: `Only the bot owner can execute this command!`, ephemeral: true })
            const bot = interaction.client;
            const guilds = bot.guilds.cache;

            let guildCount = 0;
            let memberCount = 0;

            guilds.forEach(guild => {
                guildCount++;
                memberCount += guild.memberCount;
            });

            const embed = new EmbedBuilder()
            .setDescription(`Total Guilds: ${guildCount}, Total Members: ${memberCount.toLocaleString()}`)
            .setColor("Blue")
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: `There was an error executing this command! Error: ${error}`, ephemeral: true });
        }
    }
};

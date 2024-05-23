const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")



module.exports = {
    data: new SlashCommandBuilder()
    .setName("getinfo")
    .setDescription("Get details of a user in the discord server")
    .addUserOption(option => 
        option
        .setName("user")
        .setDescription("The user you want to retrieve information from")
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
        const useroption = interaction.options.getUser("user")
        const useroptionid = useroption.id
        const userResolve = interaction.guild.members.resolve(useroption)
        const UserJoinedAt = `<t:${Math.floor(userResolve.joinedAt.getTime() / 1000)}:F>`
        const UserCreatedAt = `<t:${Math.floor(userResolve.user.createdAt.getTime() / 1000)}:F>`
        const Banlist = await interaction.guild.bans.fetch()
        const isBanned = Banlist.get(userResolve.id)
        let isBannedResult;
        if (isBanned) isBannedResult = `<a:check:790322197482700821>`;
        if (!isBanned) isBannedResult = `<:bot_no1:1226545118673109093>`;
        const embed = new EmbedBuilder()
        .setDescription(`User Information`)
        .setColor("Blue")
        .setAuthor(
            { name: `${useroption.username}`, iconURL: `${userResolve.displayAvatarURL()}` }
        )
        .addFields(
            { name: "<:user:1210689168951345233> User", value: `${useroption} / ${useroption.username}`},
            { name: "<:userid:1210679548954288138> User Id", value: useroptionid },
            { name: "<:joinedat:1210681012204605470> Joined At", value: UserJoinedAt, inline: true},
            { name: "<:joinedat:1210681012204605470> Created At", value: UserCreatedAt, inline: true},
            { name: "IsBanned", value: `${isBannedResult}`, inline: true}
        )
        interaction.reply({ embeds: [embed] })
            } catch (error) {
                interaction.reply({ content: `There was an error executing this command, error: ${error}`, ephemeral: true })
            }
        }
}
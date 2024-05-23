const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, userMention } = require("discord.js");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")


module.exports = {
    data: new SlashCommandBuilder()
    .setName("checkban")
    .setDescription("Check if a user is banned")
    .addStringOption(option =>
        option
        .setName("userid")
        .setDescription("The ID of the user you want to retrieve ban information from")
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
                if (interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                    const Banlist = await interaction.guild.bans.fetch()
                    const userid = interaction.options.getString("userid")
                    let isBannedResult;
                    const UserMention =  await interaction.client.users.fetch(userid)
                    const useravatar = UserMention.displayAvatarURL()
                    let BannedReason;
                    const IsBanned = Banlist.get(userid)
                    if (IsBanned) {
                        isBannedResult = true;
                        BannedReason = IsBanned.reason
                    }
                    if (!IsBanned) isBannedResult = false;
                    const embed = new EmbedBuilder()
                    .setDescription(`Ban Details`)
                    .setColor("Blue")
                    .setAuthor(
                        { name: `${UserMention.tag}`, iconURL: useravatar }
                    )
                    .addFields(
                        { name: "IsBanned", value: `${isBannedResult}` },
                        { name: "Reason", value: `${BannedReason}` }
                    )
                    interaction.reply({ embeds: [embed] })
                }
            } catch (error) {
                interaction.reply({ content: `There was an error executing this command!`, ephemeral: true })
                console.log(error)
            }
        }
}
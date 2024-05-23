const { SlashCommandBuilder, ActivityType, EmbedBuilder, PermissionsBitField, } = require("discord.js");
const AdminData = require("..//..//Datastores/AdminsData")
const GuildBlacklistData = require("..//..//Datastores/Blacklistdata")
const BotblacklistData = require("..//..//Datastores/BotblacklistData");


module.exports = {
    data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Your Cypher Profile")
    .addStringOption(option => 
    option
.setName("userid")
.setDescription("The ID of the user you want to retrieve Cypher information from")
.setRequired(true)),

        async execute(interaction) {
            try {
                const userid = interaction.options.getString("userid")
                const GuildMember = await interaction.guild.members.fetch(userid)
                const ClientMember = GuildMember.user
                const AdminDataConst = await AdminData.findOne({ AdminIds: userid})
                const GuildBlacklistConst = await GuildBlacklistData.findOne({ UserId: userid, GuildId: interaction.guild.id })
                const BotBlacklistConst = await BotblacklistData.findOne({ UserId: userid })
                const Bot = interaction.client.user 
                const BotAvatar = Bot.displayAvatarURL()
                let Start;
                let GuildResult;
                let BotBlacklistResult;

                if (!AdminDataConst) {
                    Start = "Member"
                }

                if (AdminDataConst) {
                    Start = "Administrator"
                }

                if (GuildBlacklistConst) {
                    GuildResult = `<:checkmark1:1225812823267868762>`
                }

                if (!GuildBlacklistConst) {
                    GuildResult = `<:bot_no1:1226545118673109093>`
                }

                if (BotBlacklistConst) {
                    BotBlacklistResult = `<:checkmark1:1225812823267868762>`
                }

                if (!BotBlacklistConst) {
                    BotBlacklistResult = `<:bot_no1:1226545118673109093>`
                }
                    const SuccessEmbed = new EmbedBuilder()
                    .setAuthor(
                        { name: `${ClientMember.username}'s Profile`, iconURL: ClientMember.displayAvatarURL() }
                    )
                    .setDescription(`Information`)
                    .addFields(
                        { name: `<:Profile:1226204099435954318> Cypher Rank`, value: `${Start}` },
                        { name: `Server Blacklisted`, value: `${GuildResult}`, inline: true },
                        { name: `Bot Blacklisted`, value: `${BotBlacklistResult}`, inline: true },
                        { name: `Joined At`, value: `<t:${Math.floor(GuildMember.joinedAt.getTime() / 1000)}:F>` },
                        { name: `Created At`, value: `<t:${Math.floor(ClientMember.createdAt.getTime() / 1000)}:F>` },
                        )
                        .setThumbnail(BotAvatar)
                    .setTimestamp()
                    .setColor("Blue")
                    interaction.reply({ embeds: [SuccessEmbed] })
            } catch (error) {
                interaction.reply({ content: `There was an error executing this command, error: ${error}`, ephemeral: true })
                console.log(error)
            }
        }
}
const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const BlacklistedData = require("..//..//Datastores/Blacklistdata")
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")



module.exports = {
    data: new SlashCommandBuilder()
    .setName("checkblacklist")
    .setDescription("Check if a user is blacklisted from this guild")
    .addStringOption(option =>
        option
        .setName("userid")
        .setDescription("The ID of the user")
        .setRequired(true)),

        async execute(interaction) {
                try {
                    const GuildId = interaction.guild.id
                    const UserId = interaction.options.getString("userid")
                    const Reason = interaction.options.getString("reason")
                    const CommandUser = interaction.user.id;
                    let BlacklistConst = await BlacklistedData.findOne({ GuildId: GuildId, UserId: UserId })
                    let BotBlacklistDataConst = await BotBlacklistedData.findOne({ UserId: CommandUser });

                    if (BotBlacklistDataConst) {
                        const embed3 = new EmbedBuilder()
                        .setDescription("<:bot_no1:1226545118673109093> You are blacklisted from using this bot!")
                        .setColor("Red");
                        interaction.reply({ embeds: [embed3] });
                        return;
                    }

                    if (BlacklistConst) {
                        const embed = new EmbedBuilder()
                        .setDescription(`The user <@${UserId}> is blacklisted from this guild! || **${BlacklistConst.Reason}**`)
                        .setColor("Red")

                        interaction.reply({ embeds: [embed] })
                        return;
                    }

                    if (!BlacklistConst) {
                        const NotBlacklistedEmbed = new EmbedBuilder()
                        .setDescription(`<:bot_no1:1226545118673109093> No blacklist data for <@${UserId}> has been found.`)
                        .setColor("Blue")   
                        
                        interaction.reply({ embeds: [NotBlacklistedEmbed] })
                    }
                } catch (error) {
                    console.log("There was an error:", (error));
            }
        }
}
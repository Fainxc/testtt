const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, Embed } = require("discord.js");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")
const AdminData = require(`..//..//Datastores/AdminsData`);


module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server")
    .addUserOption(option => 
        option
        .setName("target")
        .setDescription("The user you want to ban")
        .setRequired(true))
    .addStringOption(option =>
        option
        .setName("reason")
        .setDescription("The reason for this action")
        .setRequired(false)),

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

                    const target = interaction.options.getUser("target")
                    const reason = interaction.options.getString("reason") || "No reason provided."
                    const TargetToBan = await interaction.guild.members.resolve(target)
                    let TargetAdminDataConst = await AdminData.findOne({ AdminIds: target.id })

                    if (TargetAdminDataConst) {
                        const embed4 = new EmbedBuilder()
                        .setDescription(`<:bot_no1:1226545118673109093> You cannot ban a Cypher Staff!`)
                        .setColor("Red");
                        interaction.reply({ embeds: [embed4] });
                        return;
                    }
                    
                    if (interaction.user.id === target.id) {
                        const BanYourSelfError = new EmbedBuilder()
                        .setDescription("<:bot_no1:1226545118673109093> You can not ban yourself!")
                        .setColor("Red")
                        interaction.reply({ embeds: [BanYourSelfError] })
                        return;
                    }

                    if (interaction.member.roles.highest.position < TargetToBan.roles.highest.position) {
                        const BanHRError = new EmbedBuilder()
                        .setDescription("<:bot_no1:1226545118673109093> You can not ban someone higher than you!")
                        .setColor("Red")
                        interaction.reply({ embeds: [BanHRError] })
                        return;
                    }

                    const Bot = interaction.guild.members.resolve(interaction.client.user.id)

                    if (Bot.roles.highest.position <= TargetToBan.roles.highest.position) {
                        const BanHRError1 = new EmbedBuilder()
                        .setDescription("<:bot_no1:1226545118673109093> I can not ban someone higher or equal to me!")
                        .setColor("Red")
                        interaction.reply({ embeds: [BanHRError1] })
                        return;
                    }
                    const TargetDmEmbed = new EmbedBuilder()
                    .setDescription("You've been banned from Social Hangout!")
                    .setTitle("Banned")
                    .setColor("Red")
                    .addFields(
                        { name: "Moderator", value: interaction.user.username },
                        { name: "Ban Reason", value: reason},
                        { name: "Your ID", value: target.id},
                        { name: "Your Username", value: target.username }
                    )
                    const DmMessageEmbed = new EmbedBuilder()
                    .setDescription(`<:checkmark1:1225812823267868762> Successfully banned!`)
                    .setTitle("Ban Applied")
                    .addFields(
                        { name: "Moderator", value: interaction.user.username },
                        { name: "Ban Reason", value: reason},
                        { name: "Victim ID", value: target.id},
                        { name: "Victim Username", value: target.username }
                    )
                    .setColor("Green")
                    const SuccessEmbed = new EmbedBuilder()
                    .setDescription(`<:checkmark1:1225812823267868762> Successfully banned ${target} || **${reason}**`)
                    .setColor("Green")
                    await TargetToBan.ban({reason}).catch(error => console.log(error))
                    interaction.user.send({ embeds: [DmMessageEmbed] }).catch(error => console.log(`Couldn't DM the user, Error: ${error}`))
                    TargetToBan.send({ embeds: [TargetDmEmbed] }).catch(error => console.log(`Couldn't DM the user, Error: ${error}`))
                   await interaction.reply({ embeds: [SuccessEmbed] })

                } else {
                    const Failembed = new EmbedBuilder()
                    .setDescription("<:bot_no1:1226545118673109093> You need the Ban Member permission to execute this command!")
                    .setColor("Red")
                    interaction.reply({ embeds: [Failembed] })
                }
            } catch (error) {
                await interaction.reply({ content: `There was an error executing this command!`, ephemeral: true })
                console.log(error)
            }
         }
    }
    
       

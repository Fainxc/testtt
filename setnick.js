const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")




module.exports = {
    data: new SlashCommandBuilder()
    .setName("setnick")
    .setDescription("Set a new nickname for someone")
    .addUserOption(option =>
        option
        .setName("user")
        .setDescription("The user you want to update")
        .setRequired(true))

    .addStringOption(option =>
        option
        .setName("newnick")
        .setDescription("The new nickname for the user")
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
        if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
            
            const target = interaction.options.getUser("user")
            const NewNickName = interaction.options.getString("newnick")
            const targetGuild = interaction.guild.members.resolve(target)
            let errorStop = 0;

            await targetGuild.setNickname(NewNickName).catch(async error  => {
                const PermsEmbed = new EmbedBuilder()
                .setDescription(`<:bot_no1:1226545118673109093> I do not have permission to change ${target}'s nickname!`)
                .setColor("Red")
                errorStop = 1;
                await interaction.reply({ embeds: [PermsEmbed] })
                return;
            })

            if (errorStop === 1) {
                return;
            }
            const embed = new EmbedBuilder()
            .setDescription(`<:checkmark1:1225812823267868762> Successfully set the nickname ${NewNickName} for ${target}!`)
            .setColor("Green")
            interaction.reply({ embeds: [embed] })
        } else {
            const FailEmbed = new EmbedBuilder()
            .setDescription(`<:bot_no1:1226545118673109093> You need the Manage Nicknames permission to execute this command <@${interaction.user.id}>!`)
            .setColor("Red")
            interaction.reply({ embeds: [FailEmbed] })
        }
            } catch (error) {
                interaction.reply({ content: `There was an error executing this command, error: ${error}`, ephemeral: true })
                console.log(error)
            }
        }
}
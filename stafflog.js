const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const BotBlacklistedData = require("../../Datastores/BotblacklistData")
const QuotaData = require("../../Datastores/QuotaData")


module.exports = {
    data: new SlashCommandBuilder()
    .setName("stafflog")
    .setDescription("Set your logs in place")
    .addStringOption(option => 
        option
        .setName("username")
        .setDescription("The user you moderated")
        .setRequired(true))

    .addStringOption(option => 
        option
        .setName("reason")
        .setDescription("The reason for the action you took towards the user")
        .setRequired(false))

        .addStringOption(option => 
            option
            .setName("type")
            .setDescription("The action you took towards the user, e.g: 'kick'")
            .setRequired(false))

        .addStringOption(option => 
            option
            .setName("evidence")
            .setDescription("Attach evidence")
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
        if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
            const target = interaction.options.getString("username")
            const reason = interaction.options.getString("reason") || "No reason provided."
            const type = interaction.options.getString("type") || "Type wasn't provided.";
            const evidence = interaction.options.getString("evidence") || "No evidence provided.";
            let QuotaDataConst = await QuotaData.findOne({ GuildId: interaction.guild.id, UserId: interaction.user.id })
            if (QuotaDataConst) {
                QuotaDataConst.Logs = Number(QuotaDataConst.Logs) + 1;
                await QuotaDataConst.save()
            }

            if (!QuotaDataConst) {
                QuotaDataConst = new QuotaData({ GuildId: interaction.guild.id, UserId: interaction.user.id, Logs: 1 })
                await QuotaDataConst.save()
            }
            const embed = new EmbedBuilder()
            .setAuthor(
                { name: "Support Server", iconURL: `https://th.bing.com/th/id/OIG2.s0pOBV.v7Prnc1qV2JsI?w=1024&h=1024&rs=1&pid=ImgDetMain`, url: `https://discord.gg/yGDS9RJ52N` }
            )
            .setTitle("Staff Log")
            .setColor("Green")
            .addFields(
                {name: "Username", value: `${target}`, inline: false},
                {name: "Reason", value: `${reason}`, inline: true},
                {name: "Type", value: `${type}`, inline: true},
                {name: "Evidence", value: `${evidence}`, inline: false},
                )
            .setFooter({ text: `By: ${interaction.user.username} || Total Logs: ${QuotaDataConst.Logs}`, iconURL: `${interaction.user.displayAvatarURL()}`})

            interaction.reply({ embeds: [embed] })
        }
            } catch (error) {
                interaction.reply({ content: `There was an error executing this command, error: ${error}`, ephemeral: true })
                console.log(error)
            }
        }
}
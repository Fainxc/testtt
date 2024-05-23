const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const BotBlacklistedData = require("..//..//Datastores/BotblacklistData")


module.exports = {
    data: new SlashCommandBuilder()
    .setName("quota")
    .setDescription("Set a quota for your staff members")
    .addUserOption(option => 
        option
        .setName("user")
        .setDescription("The user you are setting a quota to")
        .setRequired(true))

    .addStringOption(option => 
        option
        .setName("amount")
        .setDescription("The amount of logs they have to do due to a specific date.")
        .setRequired(true))

        .addStringOption(option => 
            option
            .setName("due")
            .setDescription("The date when these logs have to be completed by the user")
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
        if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            const target = interaction.options.getUser("user")
            const amount = interaction.options.getString("amount")
            const due = interaction.options.getString("due") || "No date provided.";
            const embed = new EmbedBuilder()
            .setAuthor(
                { name: "Support Server", iconURL: `https://th.bing.com/th/id/OIG2.s0pOBV.v7Prnc1qV2JsI?w=1024&h=1024&rs=1&pid=ImgDetMain`, url: `https://discord.gg/yGDS9RJ52N` }
            )
            .setDescription(`**Quota**`)
            .setColor("Purple")
            .addFields(
                {name: "User", value: `<@${target.id}>`, inline: true},
                {name: "Amount of Logs", value: `${amount}`, inline: true},
                )
            .setFooter({ text: `Due: ${due}`})

            interaction.reply({ embeds: [embed] })
        }
            } catch (error) {
                interaction.reply({ content: `There was an error executing this command, error: ${error}`, ephemeral: true })
                console.log(error)
            }
        }
}
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const embedImage = '../../../images/smplogo.png';

module.exports = {
    data: new SlashCommandBuilder() 
        .setName('embedrules')
        .setDescription('Embed Rules Command (ADMIN ONLY)')
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('The Channel To Send The Embed')
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply();

        const guild = interaction.guild;
        const member = interaction.member;
        if (!member.roles.cache.has('1189422170913382472')) {
            await interaction.editReply({ content: 'You do not have permission to run this command.', ephemeral: true });
            console.log('Unauthorized Command Usage!');
            return;
        }

        const rulesMessage = `**1.)** Follow Discord's Terms of Service and Community Guidelines:
        https://discord.com/terms
        https://discord.com/guidelines\n
        **2.)** Treat everyone with respect, if you wouldn't like people doing it to you then don't do it to them.\n
        **3.)** NO NSFW content on the server in any form. \n
        **4.)** Don't post personal or private information about yourself or others.\n
        **5.)** Don't spam things in any channel.\n
        **6.)** Use the correct channel for the correct occasion don't be advertising in general.\n
        **7.)** Must Love Mules.\n
        **8.)** No Taylor Swift (we don't like her here...).\n
        **9.)** No Enemies if you're on an opposing team scram.\n
        **10.)** Respect the staff members and don't spam ping them or anyone else on the server.\n
        **Note:** Punishments for violating any of these rules are to the discretion of the staff. So don't break the rules and you won't have to find out what those punishments might be.
        =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`

        const rulesembed = new EmbedBuilder()
            .setColor(255)
            .setTitle("Rules")
            .setDescription(rulesMessage)
            .setImage('https://media.discordapp.net/attachments/1186374013858087092/1186374786822193312/artemis_smp_text_logo.png?ex=659c3f1e&is=6589ca1e&hm=225ffa488ec0945827d5e0ec05b9e83febc2e4344f11c6a441992555822b8527&=&format=webp&quality=lossless')
            .setFooter({
                text: "Created by Gali7 for the Muletopia Community",
                iconURL: "https://raw.githubusercontent.com/GaliEXE/Bridge-Duels-Bot/main/ChannelLogo.png",
            });

            const channelId = interaction.options.getChannel('channel').id;
            const channel = interaction.client.channels.cache.get(channelId);

            if (channel) {
                channel.send({ embeds: [rulesembed] });
                await interaction.editReply({ content: 'Embeds Successfully Inserted' });
                console.log("embed inserted");
            } else {
                await interaction.editReply({ content: 'Err 404: Channel Not Found!'});
                console.log('Specified channel not found');
            }
    }
}
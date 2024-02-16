const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification')
        .setDescription('Creates the Verification Embed')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The Channel to Send the Embed')
                .setRequired(true)),
    async execute(interaction) {

        // Check To See if User has Authorization to Run Command
        const member = interaction.member;
        //const isAdmin = member.has.permissions('ADMINISTRATOR')
        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You Don\'t Have Permission To Run This Command!', ephemeral: true });
        }


        const verify = new ButtonBuilder()
            .setCustomId('verification')
            .setLabel('Verify')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false);

        const row = new ActionRowBuilder()
            .addComponents(verify);



        await interaction.deferReply();

        const verifyEmbed = new EmbedBuilder()
            .setColor(1)
            .setTitle("Verify")
            .setDescription("If You See This Channel You Are Not Verified!\n Press The Button To Get Verified!")
            .setFooter({ text: 'Created By Gali.exe For The Muletopia Community', iconURL: "https://raw.githubusercontent.com/GaliEXE/Bridge-Duels-Bot/main/ChannelLogo.png" });

        const channelId = interaction.options.getChannel('channel').id;
        const channel = interaction.client.channels.cache.get(channelId);

        if (channel) {
            await channel.send({ embeds: [verifyEmbed] });
            await channel.send({ components: [row] })
            await interaction.editReply({ content: 'Embed Successfully Inserted' });
        } else {
            console.log('Specified channel not found');
            await interaction.editReply({ content: 'Specified channel not found', ephemeral: true });
        }
    }
};
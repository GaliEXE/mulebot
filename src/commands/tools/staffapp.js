const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('staffapp')
        .setDescription('Creates the Ticket Embed For Staff Applications')
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


        const createTicket = new ButtonBuilder()
            .setCustomId('staffAppBttn')
            .setLabel('Create Staff Application')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false);

        const row = new ActionRowBuilder()
            .addComponents(createTicket);



        await interaction.deferReply();

        const ticketEmbed = new EmbedBuilder()
            .setColor(255)
            .setTitle("Create A Staff Application")
            .setDescription("If you would like to join our staff team click the button below.")
            .setFooter({ text: 'Created By Gali.exe For The Muletopia Community', iconURL: "https://raw.githubusercontent.com/GaliEXE/Bridge-Duels-Bot/main/ChannelLogo.png" });

        const channelId = interaction.options.getChannel('channel').id;
        const channel = interaction.client.channels.cache.get(channelId);

        if (channel) {
            await channel.send({ embeds: [ticketEmbed] });
            await channel.send({ components: [row] })
            await interaction.editReply({ content: 'Embed Successfully Inserted' });
        } else {
            console.log('Specified channel not found');
            await interaction.editReply({ content: 'Specified channel not found', ephemeral: true });
        }
    }
};

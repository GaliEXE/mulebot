const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField  } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('embedtickets')
    .setDescription('Creates Ticket Embed For All Tickets')
    .addChannelOption(option =>
        option.setName('channel')
            .setDescription('The Channel to Send the Embed')
            .setRequired(true)),
    async execute(interaction){

        const member = interaction.member
        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You don\'t Have Permission To Run This Command!', ephemeral: true})
        }

        const createStaffTicket = new ButtonBuilder()
            .setCustomId('staffAppBttn')
            .setLabel('Create Staff Application')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false);

        const createAppTicket = new ButtonBuilder()
            .setCustomId('ticketcreation')
            .setLabel('Create App Ticket')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false);

        const createTeamTicket = new ButtonBuilder()
            .setCustomId('teamTcktBttn')
            .setLabel('Create Team Request')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false);

        const row = new ActionRowBuilder()
            .addComponents(createStaffTicket, createAppTicket, createTeamTicket);
        
        await interaction.deferReply();

        const ticketHub = `Welcome To The Ticket Hub:\n
        If you need assistance with your application please click the "Create App Ticket" button\n
        If you would like to apply to our staff team please click the "Create Staff Application" button\n
        If you would like to apply to our team or propose a alliance please click the "Create Team Request" Button`

        const ticketEmbed = new EmbedBuilder()
            .setColor(255)
            .setTitle('Create A Ticket')
            .setDescription(ticketHub)
            .setFooter({ text: 'Created By Gali.exe For The Muletopia Community', iconURL: "https://raw.githubusercontent.com/GaliEXE/Bridge-Duels-Bot/main/ChannelLogo.png" });
        
            const channelId = interaction.options.getChannel('channel').id;
            const channel = interaction.client.channels.cache.get(channelId);

        if (channel) {
            await channel.send({ embeds: [ticketEmbed] });
            await channel.send({ components: [row] });
            await interaction.editReply({ content: 'Embed Successfully Inserted' });
        } else {
            console.log('Specified Channel Not Found.');
            await interaction.editReply({ content: 'Specified Channel Not Found!', ephemeral: true});
        }
    }
}

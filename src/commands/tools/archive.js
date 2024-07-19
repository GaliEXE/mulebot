const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('archive')
        .setDescription('Archives a channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel to be archived')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for channel archive')
                .setRequired(true)),
    async execute(interaction) {

        const member = interaction.member;
        if (!member.roles.cache.has('1189422170913382472')) {
            await interaction.editReply({ content: 'You do not have permission to run this command!', ephemeral: true});
            console.log('Unauthorized Command Usage!');
            return;
        }

        const channel = interaction.options.getChannel('channel');

        const content = interaction.options.get('reason').value;
        const categoryID = '1195495155051016212';
        const embedMessage = `This Channel Has Been Archived!
        **Reason:** ${content}`

        try {
            await channel.setParent(categoryID, { lockPermissions: true });
            const embed = new EmbedBuilder()
                .setTitle('Channel Archived')
                .setDescription(embedMessage);

            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    }
}; 

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { startTimer } = require('../../bot')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('moontick')
        .setDescription('Starts the Blood Moon Timer')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The Channel to Send the Blood Moon Warnings')
                .setRequired(true)),

    async execute(interaction) {
        const channelId = interaction.options.getChannel('channel').id;
        const channel = interaction.client.channels.cache.get(channelId);


        startTimer(channel);

        await interaction.reply({ content: 'Blood Moon Timer Started!', ephemeral: true });
    }
}
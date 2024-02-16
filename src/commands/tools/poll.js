const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pollcreate")
        .setDescription('Set Up A Poll')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('What Channel To Send The Poll To.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('polltype')
            .setDescription('Choose Numbered or Unnumbered Poll')
            .addChoices(
                { name: 'Numbered Poll', value: 'numbered_poll' },
                { name: 'Unnumbered Poll', value: 'unnumbered_poll'}
            )
            .setRequired(true)),
    async execute(interaction){

        interaction.deferReply();

        const member = interaction.member;
        if(!member.permissions.has(PermissionsBitField.Flags.Administrator)){
            return interaction.reply({ content: 'You Don\'t Have Permission To Run This Command!'})
        }

        const pollType = interaction.option.getString('polltype')

        if (pollType === 'numbered_poll'){
            interaction.options.addStringOption(option =>
                option.setName('option_1')
                .setDescription('Option #1')
                .setRequired(true))
            interaction.options.addStringOption(option =>
                option.setName('option_2')
                .setDescription('Option #2'))
            interaction.options.addStringOption(option =>
                option.setName('option_3')
                .setDescription('Option #3'))
            interaction.options.addStringOption(option =>
                option.setName('option_4')
                .setDescription('Option #4'))
            interaction.options.addStringOption(option =>
                option.setName('option_5')
                .setDescription('Option #5'))
            interaction.options.addStringOption(option =>
                 option.setName('option_6')
                .setDescription('Option #6'))
            interaction.options.addStringOption(option =>
                option.setName('option_7')
                .setDescription('Option #7'))
            interaction.options.addStringOption(option =>
                option.setName('option_8')
                .setDescription('Option #8'))
            interaction.options.addStringOption(option =>
                option.setName('option_9')
                .setDescription('option #9'))
        }
    }
}
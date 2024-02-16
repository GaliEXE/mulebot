const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketreply')
        .setDescription('reply to a ticket')
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('The Channel To Send The Embed')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('user')
            .setDescription('User the embed is replying to. Please put there username exactly.')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('title')
            .setDescription('Title of the reply')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
            .setDescription('Message You Want To Reply With.')
            .setRequired(true))
            .addStringOption(option =>
                option.setName('signed')
                .setDescription('Which names to leave at the end of the embed (Type Default to use council members as signed)')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('tone')
                .setDescription('Sets the color of the embed to match the responce.')
                .setRequired(true)
                .addChoices(
                    { name: 'Good', value: 'Good'},
                    { name: 'Bad', value: 'Bad'},
                    { name: 'Neutral', value: 'Neutral'}
                )),
    async execute(interaction) {

    const userInput = interaction.options.get('user').value.toLowerCase()
    const userId = interaction.client.users.cache.find(u => u.username === userInput).id;
    const msgInput = interaction.options.get('message').value
    const titleInput = interaction.options.get('title').value
    const toneInput = interaction.options.get('tone').value
    const embedColor = await color(toneInput)
    console.log(embedColor)
    let signedInput = interaction.options.get('signed').value.toLowerCase();
    if(signedInput === 'default'){
        let signed ='<@1036870797756739604>, <@645379786679779333>, <@1071398362374484069>'
        messageEmbed(signed);
    } else {
        signedId = interaction.client.users.cache.find(u => u.username === signedInput).id
        let signed = `<@${signedId}>`
        messageEmbed(signed);
    }

    function color(toneInput) {
        console.log(toneInput)
        return new Promise(resolve => {
            let embedColor;
            if (toneInput === 'Good') {
                embedColor = 32768;
            } else if (toneInput === 'Bad') {
                embedColor = 16711680;
            } else if (toneInput === 'Neutral') {
                embedColor = 255;
            }
            resolve(embedColor);
        });
    }

    console.log(userId);
    async function messageEmbed(signed){

        await interaction.deferReply();
        console.log(embedColor)

        const embedMsg = `Dear <@${userId}>,

        ${msgInput}
        
        Sincerely,
        
        ${signed}
        The Mule Council
        Muletopian Discord Community`
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle(`${titleInput}`)
            .setDescription(embedMsg)
            .setFooter({ text: 'Created By Gali.exe For The Muletopia Community', iconURL: "https://raw.githubusercontent.com/GaliEXE/Bridge-Duels-Bot/main/ChannelLogo.png" });

            const channelId = interaction.options.getChannel('channel').id;
            const channel = interaction.client.channels.cache.get(channelId);

            if (channel) {
                await channel.send({ embeds: [embed] });
                await interaction.editReply({ content: 'Embed Successfully Inserted' });
            } else {
                console.log('Specified channel not found');
                await interaction.editReply({ content: 'Specified channel not found', ephemeral: true });
            }

    }
    }
}
require('dotenv').config();
const { token } = process.env
const { Client, Collection, GatewayIntentBits, Events, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const timers = new Map();


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.login(token);
client.handleCommands();

module.exports = {
    startTimer,
}

function startTimer() {
    setInterval(() => {
        timers.forEach((startTime, channelId) => {
            const currentTime = new Date();
            const elapsedTime = Math.floor((currentTime - startTime) / (60 * 1000));

            if (elapsedTime >= 120) {
                // Timer has reached 2 hours, reset the timer
                timers.set(channelId, currentTime);

                // Calculate the "day" based on the elapsed time
                const day = Math.floor(elapsedTime / 20);

                // You can perform actions here if needed (e.g., sending a message)
                const channel = client.channels.cache.get(channel.id);
                if (channel) {
                    if (channel.isText()) {
                        const embed = new EmbedBuilder()
                            .setTitle('2-Hour Timer Update')
                            .setDescription(`The 2-hour timer has reached completion. Restarting the timer.\nCurrent day: Day ${day}.`)
                            .setColor('#0099ff');

                        // Send a new message
                        channel.send({ embeds: [embed] });
                    }
                }
            }
        });
    }, 60000); // Check every minute
}

  
  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isCommand()) {
      const { commandName } = interaction;
  
      if (commandName === 'moontick') {
        const currentTime = new Date();
        const channelId = interaction.channelId;
  
        interaction.deferReply();

        if (!timers.has(channelId)) {
          timers.set(channelId, currentTime);
          interaction.reply({ content: 'Timer started.'});
        } else {
          const startTime = timers.get(channelId);
          const elapsedTime = Math.floor((currentTime - startTime) / (60 * 1000));
  
          // Calculate the "day" based on the elapsed time
          const day = Math.floor(elapsedTime / 20);
  
          const embed = new MessageEmbed()
            .setTitle('2-Hour Timer Status')
            .setDescription(`The 2-hour timer is currently on Day ${day}.`)
            .setColor('#0099ff');
  
          interaction.reply({ embeds: [embed] });
        }
      }
    }
});


client.on('guildMemberAdd', guildMember => {
    try {
        const joinRole = guildMember.guild.roles.cache.find(role => role.name === 'Unverified');
        guildMember.roles.add(joinRole);
        guildMember.guild.channels.cache.get('1189441458743291924').send(`Welcome To Muletopia <@${guildMember.user.id}>!`);
    } catch (error) {
        console.error('Error in guildMemberAdd event:', error);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton()) {
        // Check if the interaction is a button click
        const customId = interaction.customId;

        if (customId === 'closeticket') {
            // Handle close ticket button click
            const member = interaction.member;
            const username = member.user.username;

            // Get the channelId from the interaction
            const channelId = interaction.channelId;

            // Find the ticket channel by channelId
            const ticketChannel = interaction.guild.channels.cache.get(channelId);

            if (ticketChannel) {
                // Delete the ticket channel
                await ticketChannel.delete();

                // You can add additional logic here if needed

                await interaction.reply({ content: 'Ticket closed successfully!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Ticket channel not found.', ephemeral: true });
            }
        }
    }
});



client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.customId !== 'ticketcreation') return;

    try {
        await interaction.deferUpdate();

        const member = interaction.member;
        const username = member.user.username;
        const categoryID = '1189441916702560316';

        // Create the ticket channel
        const createdChannel = await interaction.guild.channels.create({
            type: ChannelType.GuildText,
            parent: categoryID,
            name: `${username}'s ticket`,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });

        createdChannel.lockPermissions()
            .then(() => console.log('Successfully synchronized permissions with parent channel'))
            .catch(console.error);
        createdChannel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true });
        // Send an embed with a close ticket button
        const closeButton = new ButtonBuilder()
            .setCustomId('closeticket')
            .setLabel('Close Ticket')
            .setStyle('Danger');

        const row = new ActionRowBuilder().addComponents(closeButton);

        const embed = new EmbedBuilder()
            .setTitle('Ticket Information')
            .setDescription(`**Welcome to your ticket** <@${member.user.id}>!
            A Team member will be respond shortly to help you with your
            application.
            **__Please Post Your Application Here!__**`)
            .setColor('#0099ff')
            .setFooter({ text: 'Created By Gali.exe For The Muletopia Community', iconURL: "https://raw.githubusercontent.com/GaliEXE/Bridge-Duels-Bot/main/ChannelLogo.png" });

        await createdChannel.send({ embeds: [embed], components: [row] });

        await interaction.followUp({ content: `Ticket channel created: ${createdChannel.name}`, ephemeral: true });
    } catch (error) {
        console.error('Error creating ticket channel:', error);
        await interaction.followUp({ content: 'Failed to create ticket channel.', ephemeral: true });
    }
});


client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.customId !== 'staffAppBttn') return;

    try {
        await interaction.deferUpdate();

        const member = interaction.member;
        const username = member.user.username;
        const categoryID = '1189441916702560316';

        // Create the ticket channel
        const createdChannel = await interaction.guild.channels.create({
            type: ChannelType.GuildText,
            parent: categoryID,
            name: `${username}'s Staff App`,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });

        createdChannel.lockPermissions()
            .then(() => console.log('Successfully synchronized permissions with parent channel'))
            .catch(console.error);
        createdChannel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true });
        // Send an embed with a close ticket button
        const closeButtonStf = new ButtonBuilder()
            .setCustomId('closeticket')
            .setLabel('Close Application')
            .setStyle('Danger');

        const row = new ActionRowBuilder().addComponents(closeButtonStf);

        const embed = new EmbedBuilder()
            .setTitle('Application Information')
            .setDescription(`**Welcome to your staff application** <@${member.user.id}>!
            A Team member will respond shortly to interview you shortly.
            **__Respond To Any Staff Questions__**`)
            .setColor('#0099ff')
            .setFooter({ text: 'Created By Gali.exe For The Muletopia Community', iconURL: "https://raw.githubusercontent.com/GaliEXE/Bridge-Duels-Bot/main/ChannelLogo.png" });

        await createdChannel.send({ embeds: [embed], components: [row] });

        await interaction.followUp({ content: `Ticket channel created: ${createdChannel.name}`, ephemeral: true });
    } catch (error) {
        console.error('Error creating ticket channel:', error);
        await interaction.followUp({ content: 'Failed to create ticket channel.', ephemeral: true });
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.customId !== 'teamTcktBttn') return;

    try{
        await interaction.deferUpdate();

        const member = interaction.member;
        const username = member.user.username;
        const categoryId = '1189441916702560316';

        const createdChannel = await interaction.guild.channels.create({
            type: ChannelType.GuildText,
            parent: categoryId,
            name: `${username}'s Team Application`,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });

        createdChannel.lockPermissions()
            .then(() => console.log('Successfully synchronized permissions with parent channel'))
            .catch(console.error);
        createdChannel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true });

        const closeButtonTeam = new ButtonBuilder()
            .setCustomId('closeticket')
            .setLabel('Close Ticket')
            .setStyle('Danger');
        
        const row = new ActionRowBuilder().addComponents(closeButtonTeam);

        const embed = new EmbedBuilder()
            .setTitle('Team Application Info')
            .setDescription(`**Welcome to the team application** <@${member.user.id}>!
            A Team member will respond shortly to discuss your request.
            Before we begin is this ticket for joining our team or allyship?
            Put your answer in this ticket!`)
            .setColor('#0099ff')
            .setFooter({ text: 'Created By Gali.exe For The Muletopia Community', iconURL: "https://raw.githubusercontent.com/GaliEXE/Bridge-Duels-Bot/main/ChannelLogo.png" });
        
        await createdChannel.send({ embeds: [embed], components: [row] });

        await interaction.followUp({ content: `Ticket channel created: ${createdChannel.name}`, ephemeral: true });
    } catch (error) {
        console.error('Error creating ticket channel:', error);
        await interaction.followUp({ content: 'Failed to create ticket channel.', ephemeral: true });
    }
})

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.customId !== 'verification') return;

    try {
        await interaction.deferUpdate();

        const member = interaction.member;
        const guild = interaction.guild;
        const roleID = member.roles.cache.has('1189421486264561684');
        const removeID = member.roles.cache.has('1189421666590261268');
        const smpmemberID = member.roles.cache.has('1189435407729971220');
        const roles = ['1189421486264561684', '1189421666590261268']
        if (removeID) {
            await member.roles.add(roles[0]);
            await member.roles.remove(roles[1]);
        } else if (smpmemberID || roleID) {
            await interaction.followUp({ content: 'You Have Already Been Verified', ephemeral: true })
        }
        ;
    } catch (error) {
        console.error('Something went wrong during verification', error)
    }
});

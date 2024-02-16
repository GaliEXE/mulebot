const { ActivityType } = require('discord.js');


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const customStatus = {
            text: 'Down For Server Transition',
            details: 'Working on cool features!'
        };

        client.user.setPresence({
            activities: [
                {
                    name: customStatus.text,
                    type: ActivityType.PLAYING,
                    details: customStatus.details
                }
            ],
            status: 'DND'
        });
        console.log(`Success! ${client.user.tag} is logged in and online`);
    }
}
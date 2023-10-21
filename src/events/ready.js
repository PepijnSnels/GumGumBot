const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {

		client.user.setActivity({
			type: ActivityType.Custom,
			name: 'status',
			state: '⛵ Sailing the Grand Line'
		})

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
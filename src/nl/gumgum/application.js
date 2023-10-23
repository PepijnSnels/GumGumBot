const path = require('node:path');
const fs = require('node:fs');
const { Client, Collection, GatewayIntentBits} = require('discord.js');
const { token } = require('../../resource/config.json');

// Create Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Load and fire events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

eventFiles.forEach(file => {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
})

// Load and configure commands
client.commands = new Collection();
const commandFolder = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandFolder).filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
    const filePath = path.join(commandFolder, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        console.log(command.data.name)
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
});




// Start bot
client.login(token);
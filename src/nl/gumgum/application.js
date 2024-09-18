const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
const crypto = require('crypto');
const { Client, Collection, GatewayIntentBits} = require('discord.js');
const config = require('../../resource/config.json');
const { subscribeToAllStreamers} = require('./webhooks/twitch');

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

// Twitch Webhook
const app = express();
app.use(express.json());

app.post('/webhook/twitch', (req, res) => {

    const messageType = req.headers['twitch-eventsub-message-type'];
    const subType = req.headers['twitch-eventsub-subscription-type']

    if (messageType == "webhook_callback_verification") {
        
        const challenge = req.body.challenge;
        
        if (challenge) {
            res.set('Content-Type', 'text/plain').status(200).send(challenge);
        } else {
            res.status(400).send('Challenge not found');
        }
    }

    if (subType == "stream.online" && messageType == "notification") {
        client.channels.fetch(config.DISCORD_CHANNEL_ID)
            .then(channel => {
                channel.send(`${req.body.event.broadcaster_user_name} is nu live! Bekijk de stream hier: https://www.twitch.tv/${req.body.event.broadcaster_user_name}`);
            })
            .catch(console.error);
        res.status(200).send('OK');
        
    }
});

app.get('/webhook/twitch', (req, res) => {
    
    const challenge = req.query['hub.challenge'];

    if (challenge) {
        res.status(200).send(challenge);
    } else {
        res.status(400).send('Challenge parameter missing');
    }
});

app.listen(3000, () => {
    console.log('Webhook server running on port 3000');
    subscribeToAllStreamers();
});

// Start bot
client.login(config.token);
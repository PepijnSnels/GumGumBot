const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { subscribeToEventSub } = require('../webhooks/twitch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addstreamer')
        .setDescription('Voegt een Twitch-streamer toe voor meldingen')
        .addStringOption(option =>
            option.setName('streamer')
                .setDescription('De naam van de Twitch-streamer die je wilt volgen')
                .setRequired(true)
        ),
    
        async execute(interaction) {
            const streamer = interaction.options.getString('streamer').toLowerCase();
    
            const streamersFile = path.join(__dirname, '../../../resource/streamers.json');
    
            if (!fs.existsSync(streamersFile)) {
                fs.writeFileSync(streamersFile, JSON.stringify({ streamers: [] }, null, 2));
            }
    
            let streamersData = { streamers: [] };
            if (fs.existsSync(streamersFile)) {
                streamersData = JSON.parse(fs.readFileSync(streamersFile, 'utf8'));
            }
    
            if (streamersData.streamers.includes(streamer)) {
                return interaction.reply({ content: `${streamer} is al toegevoegd.`, ephemeral: true });
            }
    
            streamersData.streamers.push(streamer);
            fs.writeFileSync(streamersFile, JSON.stringify(streamersData, null, 2));
            
            await subscribeToEventSub(streamer);

            return interaction.reply({ content: `${streamer} is toegevoegd aan de lijst.`, ephemeral: true });
        },
    };
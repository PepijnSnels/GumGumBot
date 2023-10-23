const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { leagueAPI } = require('../../../resource/config.json');

let region = 'EUW1'
let summonerName = ''

module.exports = {
    data: new SlashCommandBuilder()
        .setName('league')
        .setDescription('Live game information')
        .addStringOption(option =>
            option.setName('summoner')
                .setDescription('Summoner name')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('region')
                .setDescription('Region (default: EUW)')),
    async execute(interaction) {
        summonerName = interaction.options.getString('summoner');
        if (summonerName != '') {
            await getLiveMatchData()
            await interaction.reply('Pong!');
        }
        else{
            await interaction.reply('Invalid command');
        }
    },
};


const getLiveMatchData = async () => {
  try {
    // Get summoner data to get the summoner's ID
    const summonerResponse = await axios.get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`, {
      headers: {
        'X-Riot-Token': leagueAPI,
      },
    });

    const summonerData = summonerResponse.data;
    const summonerId = summonerData.id;

    // Fetch live match data using the summoner's ID
    const liveMatchResponse = await axios.get(`https://${region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerId}`, {
      headers: {
        'X-Riot-Token': leagueAPI,
      },
    });

    const liveMatchData = liveMatchResponse.data;
    console.log(liveMatchData);

  } catch (error) {
    console.error('Error:', error);
  }
};
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { leagueAPI } = require('../../../resource/config.json');

const region = 'EUW1'
let summonerName = ''
let champions = {}
const APILink = `https://${region}.api.riotgames.com`

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
    await interaction.deferReply();
    summonerName = interaction.options.getString('summoner');
    if (summonerName != '') {
      let match = await (getMatchInfo())
      let blueTeamMsg = ''
      let redTeamMsg = ''
      for (const player of match['blueTeam']) {
        blueTeamMsg += `Champion: ${player.champion},  Summoner: ${player.summonerName},  Rank: ${player.tier} ${player.rank},  LP: ${player.LP}\n`;
      }
      for (const player of match['redTeam']) {
        redTeamMsg += `Champion: ${player.champion},  Summoner: ${player.summonerName},  Rank: ${player.tier} ${player.rank},  LP: ${player.LP}\n`;
      }
      await interaction.editReply(`Blue Team:\n${blueTeamMsg}\n\n Red Team:\n${redTeamMsg}`)
    }
    else {
      await interaction.editReply('Invalid command');
    }
  },
};


async function getLatestDDragon() {

  if (Object.keys(champions).length > 0) { return champions; }
  const versions = await axios.get("https://ddragon.leagueoflegends.com/api/versions.json");
  const latest = versions.data[0];

  const ddragon = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`);

  champions = ddragon.data['data'];
}

async function getChampionByKey(key) {

  for (var championName in champions) {
      if (champions[championName]["key"] == key) {
          return championName;
      }
  }
}

async function getSummonerId(summonerName) {
  try {
      // Get summoner data to get the summoner's ID
      const summonerResponse = await axios.get(`${APILink}/lol/summoner/v4/summoners/by-name/${summonerName}`, {
          headers: {
              'X-Riot-Token': leagueAPI,
          },
      });
      return summonerResponse.data
  } catch (error) {
      console.error('Error:', error);
  }
}


async function getSummonerInfo(summonerId) {
  try {
      let sumInfo = await axios.get(`${APILink}/lol/league/v4/entries/by-summoner/${summonerId}`, {
          headers: {
              'X-Riot-Token': leagueAPI,
          },
      });
      return sumInfo.data
  } catch (error) {
      console.error('Error:', error);
  }

}

async function getliveMatchData(summonerId) {
  try {
      // Fetch live match data using the summoner's ID
      const liveMatchResponse = await axios.get(`${APILink}/lol/spectator/v4/active-games/by-summoner/${summonerId}`, {
          headers: {
              'X-Riot-Token': leagueAPI,
          },
      });
      return liveMatchResponse.data
  } catch (error) {
      console.error('Error:', error);
  }
}

async function getChampMastery(summonerId, championId) {
  try {
      // Fetch champion mastery using the summoner's ID and champion ID
      const masteryLevel = await axios.get(`${APILink}/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}/by-champion/${championId}`, {
          headers: {
              'X-Riot-Token': leagueAPI,
          },
      });
      return masteryLevel.data.championLevel

  } catch (error) {
      console.error('Error:', error);
  }
}

const getMatchInfo = async () => {
  await getLatestDDragon()
  try {
      let blueTeam = []
      let redTeam = []
      let match = {}
      const summonerId = await getSummonerId(summonerName)
      const liveMatchData = await getliveMatchData(summonerId.id)

      for (participant of liveMatchData.participants) {
          let player = {}
          let suminfo = await getSummonerInfo(participant.summonerId)
          let champion = await getChampionByKey(participant.championId);
          let mastery = await getChampMastery(participant.summonerId, participant.championId)
          player['summonerName'] = suminfo[0].summonerName
          player['champion'] = champion
          player['tier'] = suminfo[0].tier
          player['rank'] = suminfo[0].rank
          player['LP'] = suminfo[0].leaguePoints
          player['mastery'] = mastery
          if (participant.teamId == 100) {
              blueTeam.push(player)
          }
          else{
              redTeam.push(player)
          }
      }

      match['blueTeam'] = blueTeam
      match['redTeam'] = redTeam
      return match

  } catch (error) {
      console.error('Error:', error);
  }
};
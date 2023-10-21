const axios = require('axios');
const { leagueAPI } = require('./src/config.json');
let region = 'EUW1'
let summonerName = 'Keduii123'

let championJson = {};

async function getLatestDDragon() {
    
    if(Object.keys(championJson).length > 0) {return champinoJson;}
    const versions = await axios.get("https://ddragon.leagueoflegends.com/api/versions.json");
    const latest = versions.data[0];

    const ddragon = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`);

    const champions = ddragon.data['data'];
    championJson = ddragon.data['data'];
    return champions;
}

async function getChampionByKey(key) {

   const champions = await getLatestDDragon();

   for (var championName in champions) {
    if(champions[championName]["key"] == key){
        return championName;
    }
   }
}

async function main(){
   console.log(await getChampionByKey(45));
}

main()

// const getLiveMatchData = async () => {
//     try {
//         // // Get summoner data to get the summoner's ID
//         // const summonerResponse = await axios.get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`, {
//         // headers: {
//         //     'X-Riot-Token': leagueAPI,
//         // },
//         // });
    
//         // const summonerData = summonerResponse.data;
//         // const summonerId = summonerData.id;
    
//         // // Fetch live match data using the summoner's ID
//         // const liveMatchResponse = await axios.get(`https://${region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerId}`, {
//         // headers: {
//         //     'X-Riot-Token': leagueAPI,
//         // },
//         // });
        
//         const ChampID = await axios.get('https://ddragon.leagueoflegends.com/cdn/13.20.1/data/en_US/champion.json')

//         console.log(ChampID.data);

//         //const liveMatchData = liveMatchResponse.data;
//         //console.log(liveMatchData.participants[0].championId);
    
//     } catch (error) {
//         console.error('Error:', error);
//     }
//   };
  

//   async function getChampionByKey(key) {

//     const champions = await getLatestDDragon();
 
//     for (var championName in champions) {
//        if (!champions.hasOwnProperty(championName)) {continue;}
 
//        if(champions[championName]["key"] === key) {
//           return champions[championName]
//        }
//     }
 
//     return false;
 
//  }

//   getLiveMatchData();
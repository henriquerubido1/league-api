import axios from 'axios';

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 OPR/91.0.4516.95",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
  "Origin": "https://developer.riotgames.com"
};

const riotTokenHeader = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 OPR/91.0.4516.95",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
  "Origin": "https://developer.riotgames.com",
  "X-Riot-Token": "RGAPI-5c799de8-305d-4e5d-be57-0ea9aa4b3006"
};

async function getElo(id) {
  try {
    const response = await axios
      .get(`https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`, { headers: riotTokenHeader });

    console.log(response);

    return response;
  } catch (err) {
    console.log(err);
  }
}

async function getChampById(id) {
  try {
    const response = await axios
      .get('http://ddragon.leagueoflegends.com/cdn/12.20.1/data/en_US/champion.json');

    const champ = Object.values(response.data.data).find((champ) => champ.key === id.toString());

    return { name: champ.id, title: champ.title };
  } catch (err) {
    console.log(err);
  }
}

async function getMastery(id) {
  try {
    const response = await axios
      .get(`https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}?api_key=RGAPI-5c799de8-305d-4e5d-be57-0ea9aa4b3006`, { headers });

    const mainChamps = response.data.slice(0, 5);

    const mainChampsNames = mainChamps.map(async (champ) => await getChampById(champ.championId))
  
    const champs = await Promise.all(mainChampsNames);

    const result = champs.map((champ, index) => (
      {
        details: champ,
        mastery: mainChamps[index].championPoints,
      } 
    ));

    return result;
  } catch (err) {
    console.log(err);
  }
}

async function getSummoner(summoner) {
  try {
    const response = await axios
      .get(`https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}?api_key=RGAPI-5c799de8-305d-4e5d-be57-0ea9aa4b3006`, { headers });

      
    const { id, name, summonerLevel } = response.data;
      
    const elo = await getElo(id);

    const mainChampions = await getMastery(id)
    
    return { name, summonerLevel, mainChampions };
  } catch (err) {
    console.log(err);
  }
}

export default getSummoner;

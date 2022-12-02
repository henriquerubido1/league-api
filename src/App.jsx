import React, { useState } from "react";
import getSummoner from "./requests";

function App() {
  const [nickname, setNickname] = useState('');
  const [playerData, setPlayerData] = useState('');
  const [mainChampions, setMainChampions] = useState([]);
  const [player, setPlayer] = useState('');

  async function requestApi() {
    const result = await getSummoner(nickname);

    console.log(result);

    const { name, summonerLevel, mainChampions } = result;

    const title = mainChampions[0].details.title
    setPlayer({ name, summonerLevel, title });
    setMainChampions(mainChampions);

    setPlayerData(mainChampions[0].details.name);
  }

  return (
    <div className="App">
      <label htmlFor="nickname">
        type your nickname (without spaces)
        <input
          type="text"
          id="nickname"
          onChange={ (e) => setNickname(e.target.value) }
        />
      </label>
      <button
        type="button"
        onClick={ async () => await requestApi() }
      >
        Enter
      </button>
      <main>
        <header>
          <h3>
            { player.name }
          </h3>
          <p>
            { player.summonerLevel && `lvl ${player.summonerLevel}`}
          </p>
          <p>
            { player.title }
          </p>
        </header>
        {
          mainChampions.map((champ) => (
              <div>
                <img src={ `https://cdn.mobalytics.gg/assets/lol/images/dd/champions/icons/${champ.details.name.toLowerCase()}.png` } alt={ champ.details.name } />
                <p>
                  { `mastery points: ${champ.mastery}` }
                </p>
              </div>
          ))
        }
      </main>
    </div>
  )
}

export default App

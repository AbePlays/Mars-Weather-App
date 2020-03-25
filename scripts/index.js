const API_KEY = "DEMO_KEY";

const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

const currentSolElement = document.querySelector("[data-current-sol]");

function getWeather() {
  return fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const { sol_keys, validity_checks, ...solData } = data;
      return Object.entries(solData).map(([sol, data]) => {
        return {
          sol: sol,
          maxTemp: data.AT.mx,
          minTemo: data.AT.mn,
          windSpeed: data.HWS.av,
          windDirectionDegrees: data.WD.most_common.compass_degrees,
          windDirectionCardinal: data.WD.most_common.compass_point,
          date: new Date(data.First_UTC)
        };
      });
    });
}

let selectedSolIndex;
getWeather().then(sols => {
  selectedSolIndex = sols.length - 1;
  displaySelectedSol(sols);
});

function displaySelectedSol(sols) {
  const selectedSol = sols[selectedSolIndex];
  currentSolElement.innerHTML = selectedSol.sol;
}

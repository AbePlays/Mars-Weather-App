import '../style/main.scss'

const previousWeatherToggle = document.querySelector<HTMLButtonElement>(
  '.show-previous-weather'
)
const previousWeather =
  document.querySelector<HTMLDivElement>('.previous-weather')
previousWeatherToggle?.addEventListener('click', () => {
  previousWeather?.classList.toggle('show-weather')
})

const API_KEY = 'DEMO_KEY'

const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`

const currentSolElement =
  document.querySelector<HTMLSpanElement>('[data-current-sol]')
const currentDateElement = document.querySelector<HTMLParagraphElement>(
  '[data-current-date]'
)
const currentTempHighElement = document.querySelector<HTMLSpanElement>(
  '[data-current-temp-high]'
)
const currentTempLowElement = document.querySelector<HTMLSpanElement>(
  '[data-current-temp-low]'
)
const windSpeedElement =
  document.querySelector<HTMLSpanElement>('[data-wind-speed]')
const windDirectionText = document.querySelector<HTMLParagraphElement>(
  '[data-wind-direction-text]'
)
const windDirectionArrow = document.querySelector<HTMLDivElement>(
  '[data-wind-direction-arrow]'
)

const previousSolTemplate = document.querySelector<HTMLTemplateElement>(
  '[data-previous-sol-template]'
)
const previousSolContainer = document.querySelector<HTMLDivElement>(
  '[data-previous-sols]'
)

const unitToggle =
  document.querySelector<HTMLButtonElement>('[data-unit-toggle]')
const metricRadio = document.getElementById('cel') as HTMLInputElement
const imperialRadio = document.getElementById('fah') as HTMLInputElement

function getWeather() {
  return fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      console.log({ data })
      const { sol_keys, validity_checks, ...solData } = data
      return Object.entries(solData).map(([sol, data]: [any, any]) => {
        return {
          sol: sol,
          maxTemp: data.AT.mx,
          minTemp: data.AT.mn,
          windSpeed: data.HWS.av,
          windDirectionDegrees: data.WD.most_common.compass_degrees,
          windDirectionCardinal: data.WD.most_common.compass_point,
          date: new Date(data.First_UTC),
        }
      })
    })
}

let selectedSolIndex: number
getWeather().then((sols) => {
  selectedSolIndex = sols.length - 1
  displaySelectedSol(sols)
  displayPreviousSols(sols)
  updateUnits()

  if (unitToggle) {
    unitToggle.addEventListener('click', () => {
      let metricUnits = !isMetric()
      metricRadio.checked = metricUnits
      imperialRadio.checked = !metricUnits
      displaySelectedSol(sols)
      displayPreviousSols(sols)
      updateUnits()
    })
  }

  metricRadio?.addEventListener('change', () => {
    displaySelectedSol(sols)
    displayPreviousSols(sols)
    updateUnits()
  })

  imperialRadio?.addEventListener('change', () => {
    displaySelectedSol(sols)
    displayPreviousSols(sols)
    updateUnits()
  })
})

function displaySelectedSol(sols: any) {
  const selectedSol = sols[selectedSolIndex]
  if (currentSolElement) {
    currentSolElement.innerText = selectedSol.sol
  }

  if (currentDateElement) {
    currentDateElement.innerText = displayDate(selectedSol.date)
  }

  if (currentTempHighElement) {
    currentTempHighElement.innerText = displayTemp(
      selectedSol.maxTemp
    ).toString()
  }

  if (currentTempLowElement) {
    currentTempLowElement.innerText = displayTemp(
      selectedSol.minTemp
    ).toString()
  }

  if (windSpeedElement) {
    windSpeedElement.innerText = displaySpeed(selectedSol.windSpeed).toString()
  }

  if (windDirectionArrow) {
    windDirectionArrow.style.setProperty(
      '--direction',
      `${selectedSol.windDirectionDegrees}deg`
    )
  }

  if (windDirectionText) {
    windDirectionText.innerText = selectedSol.windDirectionCardinal
  }
}

function displayDate(date: Date) {
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long' })
}

function displayTemp(temp: number) {
  let returnTemp = temp
  if (!isMetric()) {
    returnTemp = (temp - 32) * (5 / 9)
  }
  return Math.round(returnTemp)
}

function displaySpeed(speed: number) {
  let returnSpeed = speed
  if (!isMetric()) {
    returnSpeed = speed / 1.609
  }
  return Math.round(returnSpeed)
}

function displayPreviousSols(sols: any) {
  if (previousSolContainer && previousSolTemplate) {
    previousSolContainer.innerHTML = ''
    sols.forEach((solData: any, index: number) => {
      const solContainer = previousSolTemplate.content.cloneNode(
        true
      ) as HTMLElement
      solContainer.querySelector<HTMLSpanElement>('[data-sol')!.innerText =
        solData.sol
      solContainer.querySelector<HTMLParagraphElement>(
        '[data-date]'
      )!.innerText = displayDate(solData.date)
      solContainer.querySelector<HTMLSpanElement>(
        '[data-temp-high]'
      )!.innerText = displayTemp(solData.maxTemp).toString()
      solContainer.querySelector<HTMLSpanElement>(
        '[data-temp-low]'
      )!.innerText = displayTemp(solData.minTemp).toString()
      solContainer
        .querySelector<HTMLButtonElement>('[data-select-button]')!
        .addEventListener('click', () => {
          selectedSolIndex = index
          displaySelectedSol(sols)
        })
      previousSolContainer.appendChild(solContainer)
    })
  }
}

function updateUnits() {
  const speedUnits =
    document.querySelectorAll<HTMLSpanElement>('[data-speed-unit]')
  const tempUnits =
    document.querySelectorAll<HTMLSpanElement>('[data-temp-unit]')

  speedUnits.forEach((unit) => {
    unit.innerText = isMetric() ? 'kmph' : 'mph'
  })

  tempUnits.forEach((unit) => {
    unit.innerText = isMetric() ? 'C' : 'F'
  })
}

function isMetric() {
  return metricRadio.checked
}

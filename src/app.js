const DEFAULT_TIER = 4
const STORAGE_KEY = 'tier'
const NBSP = ' '

const months = [
  'leden', 'únor', 'březen', 'duben', 'květen', 'červen',
  'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'
]

const daysOfMonth = [
  '',
  'prvního', 'druhého', 'třetího', 'čtvrtého', 'pátého',
  'šestého', 'sedmého', 'osmého', 'devátého', 'desátého',
  'jedenáctého', 'dvanáctého', 'třináctého', 'čtrnáctého', 'patnáctého',
  'šestnáctého', 'sedmnáctého', 'osmnáctého', 'devatenáctého', 'dvacátého'
]

const days = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota']

const hours = [
  'půlnoc', 'jedna', 'dvě', 'tři', 'čtyři', 'pět', 'šest',
  'sedm', 'osm', 'devět', 'deset', 'jedenáct',
  'poledne', 'jedna', 'dvě', 'tři', 'čtyři', 'pět', 'šest',
  'sedm', 'osm', 'devět', 'deset', 'jedenáct'
]

const minuteStrings = [
  'celá a něco',
  'za chvíli čtvrt',
  'čtvrt',
  'po čtvrt',
  'bude půl',
  'půl',
  'po půl',
  'hnedle tři čtvrtě',
  'tři čtvrtě',
  'po tři čtvrtě',
  'bude celá',
  'celá'
].map((s) => s.replaceAll(' ', NBSP))

const tiers = [
  () => 'někdy',
  (now) => String(now.getFullYear()),
  (now) => months[now.getMonth()],
  (now) => {
    const d = now.getDate()
    if (d >= 30) return ['třicátého', daysOfMonth[d - 30]].filter(Boolean).join(' ')
    if (d > 20) return ['dvacátého', daysOfMonth[d - 20]].join(' ')
    return daysOfMonth[d]
  },
  (now) => days[now.getDay()],
  (now) => {
    const h = now.getHours()
    if (h >= 6 && h < 9) return 'ráno'
    if (h >= 9 && h < 11) return 'dopoledne'
    if (h >= 11 && h < 13) return 'kolem oběda'
    if (h >= 13 && h < 18) return 'odpoledne'
    if (h >= 18 && h < 22) return 'večer'
    return 'noc'
  },
  (now) => {
    const h = now.getMinutes() > 45 ? (now.getHours() + 1) % 24 : now.getHours()
    return hours[h]
  },
  (now) => {
    const size = minuteStrings.length
    let index = (now.getMinutes() / 60) * size - 0.5
    if (index < 0) index += size
    return minuteStrings[Math.floor(index)]
  }
]

function clampTier(value) {
  const tier = Number.parseInt(value, 10)
  if (Number.isNaN(tier)) return DEFAULT_TIER
  return Math.min(Math.max(tier, 0), tiers.length - 1)
}

function loadTier() {
  try {
    return clampTier(localStorage.getItem(STORAGE_KEY))
  } catch {
    return DEFAULT_TIER
  }
}

function saveTier(tier) {
  try {
    localStorage.setItem(STORAGE_KEY, String(tier))
  } catch {
    // storage unavailable (private mode etc.), keep tier in memory only
  }
}

let activeTier = loadTier()

const timeEl = document.getElementById('time')
const lessButton = document.querySelector('[data-step="-1"]')
const moreButton = document.querySelector('[data-step="1"]')

function render() {
  const text = tiers[activeTier](new Date())
  if (timeEl.textContent !== text) {
    timeEl.textContent = text
    document.title = text.replaceAll(NBSP, ' ')
  }
  lessButton.disabled = activeTier === 0
  moreButton.disabled = activeTier === tiers.length - 1
}

function step(delta) {
  activeTier = clampTier(activeTier + delta)
  saveTier(activeTier)
  render()
}

document.getElementById('controls').addEventListener('click', (e) => {
  const button = e.target.closest('button[data-step]')
  if (button) step(Number(button.dataset.step))
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'h') step(-1)
  if (e.key === 'ArrowRight' || e.key === 'l') step(1)
})

// sync the precision between open tabs
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    activeTier = clampTier(e.newValue)
    render()
  }
})

render()
setInterval(render, 1000)

(function() {

  const DEFAULT_TIER = 4
  let activeTier = DEFAULT_TIER

  const months = [
    'leden',
    'únor',
    'březen',
    'duben',
    'květen',
    'červen',
    'červenec',
    'srpen',
    'září',
    'říjen',
    'listopad',
    'prosinec'
  ]

  const days = [
    'wtf',
    'pondělí',
    'úterý',
    'středa',
    'čtvrtek',
    'pátek',
    'sobota',
    'neděle'
  ]

  const hours = [
    'půlnoc',
    'jedna',
    'dvě',
    'tři',
    'čtyři',
    'pět',
    'šest',
    'sedm',
    'osm',
    'devět',
    'deset',
    'jedenáct',
    'poledne',
    'jedna',
    'dvě',
    'tři',
    'čtyři',
    'pět',
    'šest',
    'sedm',
    'osm',
    'devět',
    'deset',
    'jedenáct'
  ]

  const minuteStrings = [
    'celá&nbsp;a&nbsp;něco',
    'za&nbsp;chvíli&nbsp;čtvrt',
    'čtvrt',
    'po&nbsp;čtvrt',
    'bude&nbsp;půl',
    'půl',
    'po&nbsp;půl',
    'hnedle&nbsp;tři&nbsp;čtvrtě',
    'tři&nbsp;čtvrtě',
    'po&nbsp;tři&nbsp;čtvrtě',
    'bude&nbsp;celá',
    'celá'
  ]

  function validate(tier) {
    if (isNaN(tier) || tier < 0 || tier == null) { return DEFAULT_TIER }
    return Math.min(Math.max(tier, 0), tiers.length - 1)
  }

  const pref = {
    get: function() {
      const saved = localStorage.getItem('tier')
      activeTier = validate(saved)
      return activeTier
    },
    set: function(tier) {
      activeTier = validate(tier)
      localStorage.setItem('tier', '' + activeTier)
      return activeTier
    },
    minus: function() {
      return this.set(this.get() - 1)
    },
    plus: function() {
      return this.set(this.get() + 1)
    }
  }

  const tiers = [
    function() {
      return 'někdy'
    },
    function() {
      return new Date().getFullYear() + ''
    },
    function() {
      const m = new Date().getMonth()
      return months[m]
    },
    function() {
      const d = new Date().getDay()
      return days[d]
    },
    function() {
      const hours = new Date().getHours()
      if (6 <= hours && hours < 9) {
        return 'ráno'
      }
      if (9 <= hours && hours < 11) {
        return 'dopoledne'
      }
      if (11 <= hours && hours < 13) {
        return 'kolem oběda'
      }
      if (13 <= hours && hours < 18) {
        return 'odpoledne'
      }
      if (18 <= hours && hours < 22) {
        return 'večer'
      }
      return 'noc'
    },
    function() {
      let hour = new Date().getHours()
      const minutes = new Date().getMinutes()
      if (minutes > 45) {
        hour = (hour + 1) % 24
      }
      return hours[hour]
    },
    function() {
      const size = minuteStrings.length
      const minutes = new Date().getMinutes()
      let index = ((minutes / 60) * size) - 0.5
      index = index < 0 ? index + size : index
      return minuteStrings[Math.floor(index)]
    }
  ]

  function getTime(tier) {
    return tiers[tier]()
  }

  function fitText() {
    const container = document.getElementById('timeContainer')
    const el = document.getElementById('time')
    const text = el && el.innerHTML
    if (!text || !container) {
      return
    }
    const longestWord = text.split(' ').sort(function(a, b) {
      return b.length - a.length
    })[0].length
    const MAX_FONT_SIZE = 200
    const MIN_FONT_SIZE = 30
    container.style.fontSize = Math.max(Math.min(container.clientWidth / (Math.log(longestWord) * 2.6), MAX_FONT_SIZE), MIN_FONT_SIZE) + 'px'
  }

  document.addEventListener('resize', fitText)

  function render() {
    const tier = pref.get()
    const time = getTime(tier)
    document.getElementById('controls').className = 'tier' + tier
    document.getElementById('time').innerHTML = time
    document.title = time.replace(/&nbsp;/g, ' ')
    fitText()
  }

  render()

  setInterval(render, 1000)

  function onclick(e) {
    if (/less/.exec(e.target.className)) {
      e.preventDefault()
      pref.minus()
      render()
    }
    else if (/more/.exec(e.target.className)) {
      e.preventDefault()
      pref.plus()
      render()
    }
  }

  const controlsEl = document.getElementById('controls')

  controlsEl.addEventListener('click', onclick)

  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' || e.key === 'h') {
      pref.minus()
      render()
    }
    if (e.key === 'ArrowRight' || e.key === 'l') {
      pref.plus()
      render()
    }
  })

}())

DEFAULT_TIER = 4

pref =
  validate: (tier) ->
    Math.min(Math.max(tier, 0), tiers.length - 1)
  get: ->
    @validate localStorage?.getItem?('tier') or DEFAULT_TIER
  set: (tier) ->
    tier = @validate tier
    localStorage?.setItem 'tier', tier
    tier
  minus: ->
    @set @get() - 1
  plus: ->
    @set @get() + 1

tiers = [
  # nekdy
  (ts) -> 'někdy'
  # 2014
  (ts) -> moment().format('YYYY')
  # duben
  (ts) -> moment().format('MMMM')
  # pondeli
  (ts) -> moment().format('dddd')
  # dopoledne
  (ts) ->
    hours = moment().hours()
    switch
      when 6 <= hours < 9
        'ráno'
      when 9 <= hours < 11
        'dopoledne'
      when 11 <= hours < 13
        'kolem oběda'
      when 13 <= hours < 18
        'odpoledne'
      when 18 <= hours < 22
        'večer'
      else
        'noc'
  # pet
  (ts) ->
    hour = moment().hours()
    minutes = moment().minutes()
    if minutes > 45
      hour = (hour + 1)
    [
      'půlnoc'
      'jedna'
      'dvě'
      'tři'
      'čtyři'
      'pět'
      'šest'
      'sedm'
      'osm'
      'devět'
      'deset'
      'jedenáct'
      'poledne'
      'jedna'
      'dvě'
      'tři'
      'čtyři'
      'pět'
      'šest'
      'sedm'
      'osm'
      'devět'
      'deset'
      'jedenáct'
    ][hour]
  # ctvrt
  (ts) ->
    strings = [
      'celá a něco'
      'za chvíli čtvrt'
      'čtvrt'
      'po čtvrt'
      'bude půl'
      'půl'
      'po půl'
      'hnedle tři čtvrtě'
      'tři čtvrtě'
      'po tři čtvrtě'
      'bude celá'
      'celá'
    ]
    size = strings.length
    index = ((moment().minutes() / 60) * size) - 0.5
    index = if index<0 then (index+size) else index
    strings[parseInt(index)]
]

getTime = (tier) ->
  tiers[tier]()

render = ->
  tier = pref.get()
  document.getElementById('controls').className = 'tier' + tier
  document.querySelector?('#time')?.innerHTML = getTime tier

render()
setInterval render, 1000 # once per second is more than enough

if !document.addEventListener
  document.getElementById('controls').style.display = 'none'
else
  onclick = (e) ->
    e.preventDefault()
    if /less/.exec e.target.className
      pref.minus()
      render()
    else if /more/.exec e.target.className
      pref.plus()
      render()
document.addEventListener 'click', onclick, true

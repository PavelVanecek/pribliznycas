(function() {
  var DEFAULT_TIER, addEvent, controlsEl, fitText, getTime, onclick, pref, render, tiers;

  addEvent = function(emitter, name, cb) {
    if (emitter.addEventListener) {
      emitter.addEventListener(name, cb, false);
      return true;
    } else if (emitter.attachEvent) {
      emitter.attachEvent('on' + name, cb);
      return true;
    } else {
      return false;
    }
  };

  DEFAULT_TIER = 4;

  pref = {
    activeTier: DEFAULT_TIER,
    validate: function(tier) {
      return Math.min(Math.max(tier, 0), tiers.length - 1);
    },
    get: function() {
      var ex;
      try {
        this.activeTier = this.validate((typeof localStorage !== "undefined" && localStorage !== null ? typeof localStorage.getItem === "function" ? localStorage.getItem('tier') : void 0 : void 0) || this.activeTier);
      } catch (_error) {
        ex = _error;
        console.log(ex.stack);
      }
      return this.activeTier;
    },
    set: function(tier) {
      var ex;
      this.activeTier = this.validate(tier);
      try {
        if (typeof localStorage !== "undefined" && localStorage !== null) {
          localStorage.setItem('tier', this.activeTier);
        }
      } catch (_error) {
        ex = _error;
        console.log(ex.stack);
      }
      return this.activeTier;
    },
    minus: function() {
      return this.set(this.get() - 1);
    },
    plus: function() {
      return this.set(this.get() + 1);
    }
  };

  tiers = [
    function(ts) {
      return 'někdy';
    }, function(ts) {
      return moment().format('YYYY');
    }, function(ts) {
      return moment().format('MMMM');
    }, function(ts) {
      return moment().format('dddd');
    }, function(ts) {
      var hours;
      hours = moment().hours();
      switch (false) {
        case !((6 <= hours && hours < 9)):
          return 'ráno';
        case !((9 <= hours && hours < 11)):
          return 'dopoledne';
        case !((11 <= hours && hours < 13)):
          return 'kolem oběda';
        case !((13 <= hours && hours < 18)):
          return 'odpoledne';
        case !((18 <= hours && hours < 22)):
          return 'večer';
        default:
          return 'noc';
      }
    }, function(ts) {
      var hour, minutes;
      hour = moment().hours();
      minutes = moment().minutes();
      if (minutes > 45) {
        hour = (hour + 1) % 24;
      }
      return ['půlnoc', 'jedna', 'dvě', 'tři', 'čtyři', 'pět', 'šest', 'sedm', 'osm', 'devět', 'deset', 'jedenáct', 'poledne', 'jedna', 'dvě', 'tři', 'čtyři', 'pět', 'šest', 'sedm', 'osm', 'devět', 'deset', 'jedenáct'][hour];
    }, function(ts) {
      var index, size, strings;
      strings = ['celá&nbsp;a&nbsp;něco', 'za&nbsp;chvíli&nbsp;čtvrt', 'čtvrt', 'po&nbsp;čtvrt', 'bude&nbsp;půl', 'půl', 'po&nbsp;půl', 'hnedle&nbsp;tři&nbsp;čtvrtě', 'tři&nbsp;čtvrtě', 'po&nbsp;tři&nbsp;čtvrtě', 'bude&nbsp;celá', 'celá'];
      size = strings.length;
      index = ((moment().minutes() / 60) * size) - 0.5;
      index = index < 0 ? index + size : index;
      return strings[parseInt(index)];
    }
  ];

  getTime = function(tier) {
    return tiers[tier]();
  };

  fitText = function() {
    var MAX_FONT_SIZE, MIN_FONT_SIZE, container, longestWord, ref, text;
    container = document.getElementById('timeContainer');
    text = (ref = document.getElementById('time')) != null ? ref.innerHTML : void 0;
    if (!text || !container) {
      return;
    }
    longestWord = text.split(' ').sort(function(a, b) {
      return b.length - a.length;
    })[0].length;
    MAX_FONT_SIZE = 200;
    MIN_FONT_SIZE = 30;
    return container != null ? container.style.fontSize = Math.max(Math.min(container.clientWidth / (Math.log(longestWord) * 2.6), MAX_FONT_SIZE), MIN_FONT_SIZE) + 'px' : void 0;
  };

  addEvent(document, 'resize', fitText);

  render = function() {
    var tier, time;
    tier = pref.get();
    time = getTime(tier);
    document.getElementById('controls').className = 'tier' + tier;
    document.getElementById('time').innerHTML = time;
    document.title = time.replace(/&nbsp;/g, ' ');
    return fitText();
  };

  render();

  setInterval(render, 1000);

  onclick = function(e) {
    e.preventDefault();
    if (/less/.exec(e.target.className)) {
      pref.minus();
      return render();
    } else if (/more/.exec(e.target.className)) {
      pref.plus();
      return render();
    }
  };

  controlsEl = document.getElementById('controls');

  if (!addEvent(controlsEl, 'click', onclick)) {
    controlsEl.style.display = 'none';
  }

  console.log("Zdrojáky najdeš na githubu: https://github.com/PavelVanecek/pribliznycas");

}).call(this);

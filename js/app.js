var clock = new Vue({
    el: '#clock',
    data: {
        darkmodeClass: 'darkmode',
        lightmodeClass: 'lightmode',
        hour: '',
        minutes: '',
        date: '',
        bgl: '',
        previousHour: -1,
        isDarkmode: false,
        separatorOpacity: 1
    },
    computed: {
        computedOpacity: function() {
            return opacities[this.mode]
        },
        separatorOpacity: function() {
            return this.separatorOpacity;
        }
    },
    methods: {
        darkMode: function() {
            this.isDarkmode = true
            document.body.setAttribute('class', 'darkmode'); //javascript

        },
        lightMode: function() {
            this.isDarkmode = false
            document.body.setAttribute('class', 'lightmode'); //javascript
        },
        // Called by the onclick of the time in the clock to toggle darkMode
        switchmode: function() {
            this.isDarkmode ? this.lightMode() : this.darkMode()
        }
    }
});

var timerID = setInterval(updateTime, 1000);
var bglTimer = setInterval(updateBglFromNightscout, nightscoutPollInterval * 1000);

updateTime();
updateBglFromNightscout();

function updateTime() {
    var cd = new Date();
    clock.hour = zeroPadding(cd.getHours(), 2);
    clock.minutes = zeroPadding(cd.getMinutes(), 2);
    clock.date = days[cd.getDay()] + ' ' + zeroPadding(cd.getDate(), 2);

    // Flash the separator every second. The modulo 2 (%2) has it alternate between 0 and 1.
    clock.separatorOpacity = (clock.separatorOpacity + 1) % 2;

    doAutomatedDarkModeCheck(cd);
};

function doAutomatedDarkModeCheck(cd) {
    var hour = cd.getHours();
    var clockJustStarted = clock.previousHour === -1
    var justChangedInto = theHourNow(hour)
    var doAutomatedDarkModeChange =  clockJustStarted || justChangedInto(darkModeStart) || justChangedInto(darkModeEnd)
    clock.previousHour = hour
    if (doAutomatedDarkModeChange) {
        var weInDarkModeNow = hour >= darkModeStart || hour <= darkModeEnd;
        if (weInDarkModeNow) {
            clock.darkMode()
        } else {
            clock.lightMode()
        }
    }
}

function theHourNow(hour) {
    return function checkDarkMode(darkModeBoundary) {
        var lastCheckWasBeforeBoundary = clock.previousHour === darkModeBoundary - 1
        var thisCheckIsOnBoundary = hour === darkModeBoundary
        var weCrossedADarkModeBoundary = lastCheckWasBeforeBoundary && thisCheckIsOnBoundary
        return weCrossedADarkModeBoundary
    }
}

function updateBglFromNightscout() {
    axios.get(nightscoutUrl, { crossdomain: true }).then(res => {
        try {
            console.log('Got CGM update');
            var data = res.data[0];
            var bgl = data.sgv;
            if (mmol) {
                bgl = bgl / 18;
            }
            var arrow = arrows[data.direction];
            clock.bgl = round(bgl, 1) + ' ' + arrow;
        } catch (e) {
            // This will happen if Nightscout returns no BGL data
            console.log(e);
            clock.bgl = 'BGL n/a'
        }
    }).catch(console.log);
}

/* Utility functions */

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function zeroPadding(num, digit) {
    var zero = '';
    for (var i = 0; i < digit; i++) {
        zero += '0';
    }
    return (zero + num).slice(-digit);
}

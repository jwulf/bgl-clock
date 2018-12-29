var darkModeStart = 21 // 9pm
var darkModeEnd = 7 // 7am

var opacities = {
    light: 1,
    dark: 0.2
}

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
        switchmode: function() {
            this.isDarkmode ? this.lightMode() : this.darkMode()
        }
    }
});

var directions = {
    SingleDown: '↓︎',
    DoubleDown: '↓︎↓︎',
    SingleUp: '↑',
    DoubleUp: '↑↑',
    FortyFiveDown: '↘',
    FortyFiveUp: '↗',
    Flat: '→'
};

var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
var timerID = setInterval(updateTime, 1000);
var bglTimer = setInterval(updateBgl, 5000);

updateTime();
updateBgl();

function updateTime() {
    var cd = new Date();
    clock.hour = zeroPadding(cd.getHours(), 2);
    clock.minutes = zeroPadding(cd.getMinutes(), 2); /*+ ':' + zeroPadding(cd.getSeconds(), 2)*/;
    clock.separatorOpacity = (clock.separatorOpacity + 1) % 2;
    clock.date = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth() + 1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()];

    var hour = cd.getHours();

    var doAutomatedModeChange = clock.previousHour === -1 || justChangedHour(darkModeStart, hour) || justChangedHour(darkModeEnd, hour)

    clock.previousHour = hour

    if (doAutomatedModeChange) {
        var darkModeOn = hour >= darkModeStart || hour <= darkModeEnd;
        darkModeOn ? darkMode(): lightMode()
    }
};

function updateBgl() {
    axios.get('https://cgm.prahlads.space/api/v1/entries/current.json', { crossdomain: true }).then(res => {
        console.log('Got CGM update');
        clock.bgl = round(res.data[0].sgv / 18, 1) + ' ' + directions[res.data[0].direction];
    }).catch(console.log);
}

function justChangedHour(changeHour, hour) {
    return clock.previousHour === changeHour - 1 && hour === changeHour
}

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

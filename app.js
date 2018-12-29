var darkModeStart = 21 // 9pm
var darkModeEnd = 7 // 7am

var opacities = {
    light: 1,
    dark: 0.2
}

var clock = new Vue({
    el: '#clock',
    data: {
        time: '',
        date: '',
        bgl: '',
        previousHour: -1,
        mode: 'light'
    },
    computed: {
        computedOpacity: function() {
            return opacities[this.mode]
        }
    },
    methods: {
        darkMode: function() {
            this.mode = 'dark'
        },
        lightMode: function() {
            this.mode = 'light'
        },
        switchmode: function() {
            this.mode = this.mode === 'light' ? 'dark' : 'light'
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
var timerID = setInterval(updateTime, 3000);
updateTime();

function updateTime() {
    var cd = new Date();
    clock.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) /*+ ':' + zeroPadding(cd.getSeconds(), 2)*/;
    clock.date = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth() + 1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()];

    var hour = cd.getHours();

    var doAutomatedModeChange = clock.previousHour === -1 || justChangedHour(darkModeStart, hour) || justChangedHour(darkModeEnd, hour)

    clock.previousHour = hour

    if (doAutomatedModeChange) {
        var darkModeOn = hour >= darkModeStart || hour <= darkModeEnd;
        darkModeOn ? clock.darkMode() : clock.lightMode()
    }

    axios.get('https://cgm.prahlads.space/api/v1/entries/current.json', { crossdomain: true }).then(res => {
        console.log('Got it');
        clock.bgl = round(res.data[0].sgv / 18, 1) + ' ' + directions[res.data[0].direction];
    }).catch(console.log);
};

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

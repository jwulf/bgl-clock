const darkModeStart = 21
const darkModeEnd = 7

var clock = new Vue({
    el: '#clock',
    data: {
        time: '',
        date: '',
        bgl: '',
        previousHour: -1,
        opacity: 1,
        mode: 'light'
    },
    computed: {
        computedOpacity: function() {
            const opacity = {
                light: 1,
                dark: 0.2
            }
            return opacity[this.mode]
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

    const hour = cd.getHours();
    const doAutomatedModeChange = clock.previousHour !== -1 && (clock.previousHour === darkModeStart - 1 && hour === darkmodeStart) || (clock.previousHour === darkModeEnd -1 && hour === darkModeEnd)

    if (doAutomatedModeChange) {
        const nighttime = hour >= darkModeStart || hour <= darkModeEnd; // Go dark mode between 9pm and 7am
        nighttime ? clock.darkMode() : clock.lightMode()
    }

    axios.get('https://cgm.prahlads.space/api/v1/entries/current.json', { crossdomain: true }).then(res => {
        console.log('Got it');
        clock.bgl = round(res.data[0].sgv / 18, 1) + ' ' + directions[res.data[0].direction];
    }).catch(console.log);
};

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
//# sourceURL=pen.js

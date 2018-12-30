// Set to the URL for your Nightscout instance
var nightscoutUrl = 'https://cgm.prahlads.space/api/v1/entries/current.json'
// Make sure you add cors to your Nightscout plugins.
// See: https://github.com/nightscout/cgm-remote-monitor#cors-cors

// Set to false to use the US units dg/L. Set to true to use EU/AU/NZ units mmol/L
var mmol = true

// Poll Nightscout every how many seconds?
var nightscoutPollInterval = 5 // seconds

// Automatically go into dark mode in this time range. 24 hour notation, eg: 13 == 1pm
var darkModeStart = 21 // 9pm
var darkModeEnd = 7 // 7am
// Note: you can tap/click the clock time to toggle dark mode at any time


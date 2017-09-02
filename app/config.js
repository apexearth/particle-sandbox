const {setting} = require('apex-app')
const settings  = require('./settings')

module.exports = {
    view           : {
        zoomMin     : setting(.0001, .0001, 1),
        zoomMax     : setting(1000, 1, 1000),
        minDrawScale: setting(.5, .1, 10),
        fadeDelay   : setting(.25, .01, 1),
        fadeStrength: setting(.03, 0, .2),
        fadeToColor : setting(0xffffff, 0x000000, 0xffffff, "hex"),
    },
    viewMeta       : {},
    simulation     : {
        gravityStrength : setting(200, 0, 10000),
        gravityExponent : setting(2, 0, 10),
        gravityStrength2: setting(0, 0, 10000),
        gravityExponent2: setting(3, 0, 10),
        bouncePercentage: setting(.5, 0, 5),
        absorbRate      : setting(.01, .001, 1),
        heatRate        : setting(100, 1, 500),
    },
    simulationMeta : {},
    performance    : {
        updateFrequency1  : setting(1, .5, 1),
        updateFrequency2  : setting(.25, .1, 1),
        updateFrequency3  : setting(.1, .01, 1),
        distanceThreshold2: setting(25, 10, 75),
        distanceThreshold3: setting(75, 75, 200),
    },
    performanceMeta: {},
    limits         : {
        minFpsBeforeAutoRemoval: setting(10, 0, 50)
    },
    limitsMeta     : {},
}

// Fixes for when we cannot invert via CSS filter.
// Slow gradual fades to white work better than fades to black.
if (!settings.invertColors) {
    module.exports.view.fadeDelay    = setting(.25, .01, 1)
    module.exports.view.fadeStrength = setting(.05, 0, .2)
    module.exports.view.fadeToColor  = setting(0x000000, 0xffffff, 0x000000, "hex")
}
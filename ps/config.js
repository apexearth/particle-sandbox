const setting  = require('./UserInput/modes/setting')
module.exports = {
    view       : {
        zoomMin     : setting(.0001, .0001, 1),
        zoomMax     : setting(1000, 1, 1000),
        minDrawScale: setting(1, .5, 10),
    },
    simulation : {
        gravityStrength : setting(200, 0, 10000),
        gravityExponent : setting(2, 0, 10),
        gravityStrength2: setting(0, 0, 10000),
        gravityExponent2: setting(3, 0, 10),
        bouncePercentage: setting(.5, 0, 5),
        absorbRate      : setting(.01, .001, 1),
        heatRate        : setting(100, 1, 500),
    },
    performance: {
        updateFrequency1  : setting(1, .5, 1),
        updateFrequency2  : setting(.25, .1, 1),
        updateFrequency3  : setting(.1, .01, 1),
        distanceThreshold2: setting(25, 10, 75),
        distanceThreshold3: setting(75, 75, 200),
    },
    limits     : {
        minFpsBeforeAutoRemoval: setting(10, 0, 50)
    }
}

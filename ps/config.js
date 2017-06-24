module.exports = {
    view       : {
        zoomMin: .1,
        zoomMax: 2,
    },
    simulation : {
        gravityStrength: 200,
        gravityExponent: 2,
    },
    performance: {
        updateFrequency1  : 1,
        updateFrequency2  : .25,
        updateFrequency3  : .1,
        distanceThreshold2: 25,
        distanceThreshold3: 75
    },
    limits     : {
        minFpsBeforeAutoRemoval: 30
    }
}

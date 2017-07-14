module.exports = {
    view       : {
        zoomMin: .0001,
        zoomMax: 1000,
    },
    simulation : {
        gravityStrength : 200,
        gravityExponent : 2,
        gravityStrength2: 0,
        gravityExponent2: 3,
        bouncePercentage: .5,
        absorbRate      : .01,
        heatRate        : 1,
    },
    performance: {
        updateFrequency1  : 1,
        updateFrequency2  : .25,
        updateFrequency3  : .1,
        distanceThreshold2: 25,
        distanceThreshold3: 75
    },
    limits     : {
        minFpsBeforeAutoRemoval: 10
    }
}

import {setting} from 'apex-app'
import settings from './settings'

const defaults = {
    simulation: {
        gravityStrength : 200,
        gravityExponent : 2,
        gravityStrength2: 0,
        gravityExponent2: 3,
    }
}

const config = {
    quick          : {
        'No Trails'       : () => {
            config.view.fadeDelay.value    = 0
            config.view.fadeStrength.value = 1
        },
        'Short Trails'    : () => {
            config.view.fadeDelay.value    = .01
            config.view.fadeStrength.value = .03
        },
        'Medium Trails'   : () => {
            config.view.fadeDelay.value    = .125
            config.view.fadeStrength.value = .03
        },
        'Default Trails'  : () => {
            config.view.fadeDelay.value    = .25
            config.view.fadeStrength.value = .03
        },
        'Long Trails'     : () => {
            config.view.fadeDelay.value    = .25
            config.view.fadeStrength.value = .01
        },
        'Gravity ^1'      : () => {
            config.simulation.gravityStrength.value  = defaults.simulation.gravityStrength * .1
            config.simulation.gravityExponent.value  = 1
            config.simulation.gravityStrength2.value = defaults.simulation.gravityStrength2
            config.simulation.gravityExponent2.value = defaults.simulation.gravityExponent2
        },
        'Gravity ^2 (def)': () => {
            config.simulation.gravityStrength.value  = defaults.simulation.gravityStrength
            config.simulation.gravityExponent.value  = defaults.simulation.gravityExponent
            config.simulation.gravityStrength2.value = defaults.simulation.gravityStrength2
            config.simulation.gravityExponent2.value = defaults.simulation.gravityExponent2
        },
        'Gravity ^2 ^3'   : () => {
            config.simulation.gravityStrength.value  = defaults.simulation.gravityStrength * .9
            config.simulation.gravityExponent.value  = defaults.simulation.gravityExponent
            config.simulation.gravityStrength2.value = 2000
            config.simulation.gravityExponent2.value = defaults.simulation.gravityExponent2
        }
    },
    view           : {
        zoomMin     : setting(.0001, .0001, 1),
        zoomMax     : setting(1000, 1, 1000),
        minDrawScale: setting(.5, .1, 10),
        fadeDelay   : setting(.25, 0, 1),
        fadeStrength: setting(.03, 0, 1),
        fadeToColor : setting(0xffffff, 0x000000, 0xffffff, "hex"),
    },
    viewMeta       : {},
    simulation     : {
        gravityStrength : setting(defaults.simulation.gravityStrength, 0, 10000),
        gravityExponent : setting(defaults.simulation.gravityExponent, 0, 10),
        gravityStrength2: setting(defaults.simulation.gravityStrength2, 0, 10000),
        gravityExponent2: setting(defaults.simulation.gravityExponent2, 0, 10),
        bouncePercentage: setting(.5, 0, 5),
        absorbRate      : setting(.01, .001, 1),
        heatRate        : setting(100, 1, 500),
        collide         : setting(true, false, true, 'boolean'),
        bounce          : setting(true, false, true, 'boolean'),
        exchangeMass    : setting(true, false, true, 'boolean'),
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
    config.view.fadeDelay    = setting(.25, .01, 1)
    config.view.fadeStrength = setting(.05, 0, .2)
    config.view.fadeToColor  = setting(0x000000, 0xffffff, 0x000000, "hex")
}

export default config

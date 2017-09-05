const {setting} = require('apex-app')
const settings  = require('./settings')
const $         = require('jquery')

const defaults = {
    simulation: {
        gravityStrength : 200,
        gravityExponent : 2,
        gravityStrength2: 0,
        gravityExponent2: 3,
    }
}

const config = module.exports = {
    quick          : {
        ['FB Test']         : () => {
            // http://gorigins.com/posting-a-canvas-image-to-facebook-and-twitter/

            function dataURItoBlob(dataURI) {
                var byteString = atob(dataURI.split(',')[1]);
                var ab         = new ArrayBuffer(byteString.length);
                var ia         = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                return new Blob([ab], {type: 'image/png'});
            }

            function postImageToFacebook(token, filename, mimeType, imageData, message) {
                var fd = new FormData();
                fd.append("access_token", token);
                fd.append("source", imageData);
                fd.append("no_story", true);

                // Upload image to facebook without story(post to feed)
                $.ajax({
                    url        : "https://graph.facebook.com/me/photos?access_token=" + token,
                    type       : "POST",
                    data       : fd,
                    processData: false,
                    contentType: false,
                    cache      : false,
                    success    : function (data) {
                        console.log("success: ", data);

                        // Get image source url
                        FB.api(
                            "/" + data.id + "?fields=images",
                            function (response) {
                                if (response && !response.error) {
                                    //console.log(response.images[0].source);

                                    // Create facebook post using image
                                    FB.api(
                                        "/me/feed",
                                        "POST",
                                        {
                                            "message"    : "",
                                            "picture"    : response.images[0].source,
                                            "link"       : window.location.href,
                                            "name"       : 'Look at the cute panda!',
                                            "description": message,
                                            "privacy"    : {
                                                value: 'SELF'
                                            }
                                        },
                                        function (response) {
                                            if (response && !response.error) {
                                                /* handle the result */
                                                console.log("Posted story to facebook");
                                                console.log(response);
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    },
                    error      : function (shr, status, data) {
                        console.log("error " + data + " Status " + shr.status);
                    },
                    complete   : function (data) {
                        //console.log('Post to facebook Complete');
                    }
                });
            }

            let data = state.ps.renderer.view.toDataURL('image/png');
            let blob = dataURItoBlob(data);
            FB.getLoginStatus(function (response) {
                console.log(response);
                if (response.status === "connected") {
                    postImageToFacebook(response.authResponse.accessToken, "Canvas to Facebook/Twitter", "image/png", blob, window.location.href);
                } else if (response.status === "not_authorized") {
                    FB.login(function (response) {
                        postImageToFacebook(response.authResponse.accessToken, "Canvas to Facebook/Twitter", "image/png", blob, window.location.href);
                    }, {scope: "publish_actions"});
                } else {
                    FB.login(function (response) {
                        postImageToFacebook(response.authResponse.accessToken, "Canvas to Facebook/Twitter", "image/png", blob, window.location.href);
                    }, {scope: "publish_actions"});
                }
            });

        },
        ['No Trails']       : () => {
            config.view.fadeDelay.value    = 0
            config.view.fadeStrength.value = 1
        },
        ['Short Trails']    : () => {
            config.view.fadeDelay.value    = .01
            config.view.fadeStrength.value = .03
        },
        ['Medium Trails']   : () => {
            config.view.fadeDelay.value    = .125
            config.view.fadeStrength.value = .03
        },
        ['Default Trails']  : () => {
            config.view.fadeDelay.value    = .25
            config.view.fadeStrength.value = .03
        },
        ['Long Trails']     : () => {
            config.view.fadeDelay.value    = .25
            config.view.fadeStrength.value = .01
        },
        ['Gravity ^1']      : () => {
            config.simulation.gravityStrength.value  = defaults.simulation.gravityStrength * .1
            config.simulation.gravityExponent.value  = 1
            config.simulation.gravityStrength2.value = defaults.simulation.gravityStrength2
            config.simulation.gravityExponent2.value = defaults.simulation.gravityExponent2
        },
        ['Gravity ^2 (def)']: () => {
            config.simulation.gravityStrength.value  = defaults.simulation.gravityStrength
            config.simulation.gravityExponent.value  = defaults.simulation.gravityExponent
            config.simulation.gravityStrength2.value = defaults.simulation.gravityStrength2
            config.simulation.gravityExponent2.value = defaults.simulation.gravityExponent2
        },
        ['Gravity ^2 ^3']   : () => {
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
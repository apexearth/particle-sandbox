const $ = require('jquery')

window.fbAsyncInit = function () {
    window.FB.init({
        appId           : '127668774491692',
        autoLogAppEvents: true,
        xfbml           : true,
        version         : 'v2.10'
    })
    window.FB.AppEvents.logPageView()
    window.FB.postImageToFacebook = postImageToFacebook
    window.FB.ensureLoggedIn      = ensureLoggedIn
};

(function (d, s, id) {
    let js, fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) {
        return
    }
    js     = d.createElement(s)
    js.id  = id
    js.src = "//connect.facebook.net/en_US/sdk.js"
    fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'facebook-jssdk'))

// http://gorigins.com/posting-a-canvas-image-to-facebook-and-twitter/
function postImageToFacebook(token, imageData, done) {
    let fd = new FormData()
    fd.append("access_token", token)
    fd.append("source", imageData)
    fd.append("no_story", true)

    // Upload image to facebook without story(post to feed)
    $.ajax({
        url        : "https://graph.facebook.com/me/photos?access_token=" + token,
        type       : "POST",
        data       : fd,
        processData: false,
        contentType: false,
        cache      : false,
        success    : function (data) {
            // Create facebook post using image
            window.FB.ui({
                method: 'share',
                href  : 'https://www.facebook.com/photo.php?fbid=' + data.id,
            }, function (response) {
                if (response && !response.error_message) {
                    done()
                } else {
                    done(response.error_message)
                }
            })
        },
        error      : function (shr, status, data) {
            done(data)
        },
        complete   : function (data) {
            //console.log('Post to facebook Complete');
        }
    })
}

function ensureLoggedIn(fn, scope = "publish_actions") {
    window.FB.getLoginStatus(function (response) {
        if (response.status === "connected") {
            fn(response.authResponse.accessToken)
        } else if (response.status === "not_authorized") {
            window.FB.login(function (response) {
                fn(response.authResponse.accessToken)
            }, {scope})
        } else {
            window.FB.login(function (response) {
                fn(response.authResponse.accessToken)
            }, {scope})
        }
    })
}

const $ = require('jquery')

window.fbAsyncInit = function () {
    FB.init({
        appId           : '127668774491692',
        autoLogAppEvents: true,
        xfbml           : true,
        version         : 'v2.10'
    })
    FB.AppEvents.logPageView()
    FB.postImageToFacebook = postImageToFacebook
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

function postImageToFacebook(token, imageData) {
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
            console.log("success: ", data)

            // Create facebook post using image
            FB.ui({
                method: 'share',
                href  : 'https://www.facebook.com/photo.php?fbid=' + data.id,
            }, function (response) {
                if (response && !response.error_message) {
                    // alert('Posting completed.')
                } else {
                    // alert('Error while posting.')
                }
            })
        },
        error      : function (shr, status, data) {
            //console.log("error " + data + " Status " + shr.status)
        },
        complete   : function (data) {
            //console.log('Post to facebook Complete');
        }
    })
}
const state      = require('./state')
const adInterval = 10 * 60 * 1000

module.exports = {
    initialize,
}

function initialize() {
    if (window.plugins && window.plugins.AdMob) {
        window.plugins.AdMob.setOptions({
            publisherId     : 'ca-app-pub-6051654262613505/6883951206',
            interstitialAdId: 'ca-app-pub-6051654262613505/2796135609',
            adSize          : window.plugins.AdMob.AD_SIZE.SMART_BANNER,	//use SMART_BANNER, BANNER, LARGE_BANNER, IAB_MRECT, IAB_BANNER, IAB_LEADERBOARD
            bannerAtTop     : false, // set to true, to put banner at top
            overlap         : true,  // banner will overlap webview
            offsetTopBar    : false, // set to true to avoid ios7 status bar overlap
            isTesting       : true,  // receiving test ad
            autoShow        : false  // auto show interstitial ad when loaded
        })
        console.log('admob plugin initialized')

        registerAdEvents()
        startAdTimer()
    } else {
        console.log('admob plugin not ready')
    }
}

//functions to allow you to know when ads are shown, etc.
function registerAdEvents() {
    document.addEventListener('onReceiveAd', log.bind(null, 'onReceiveAd'))
    document.addEventListener('onFailedToReceiveAd', log.bind(null, 'onFailedToReceiveAd'))
    document.addEventListener('onPresentAd', log.bind(null, 'onPresentAd'))
    document.addEventListener('onDismissAd', log.bind(null, 'onDismissAd'))
    document.addEventListener('onLeaveToAd', log.bind(null, 'onLeaveToAd'))
    document.addEventListener('onReceiveInterstitialAd', msg => {
        log('onReceiveInterstitialAd', msg)
        state.emit('pendingAdvertisement')
        setTimeout(() => window.plugins.AdMob.showInterstitialAd(), 5000)
    })
    document.addEventListener('onPresentInterstitialAd', msg => {
        log('onPresentInterstitialAd', msg)
        state.emit('showAdvertisement')
    })
    document.addEventListener('onDismissInterstitialAd', msg => {
        log('onDismissInterstitialAd', msg)
        startAdTimer()

    })
    console.log('admob plugin events initialized')
}

function log(event, msg) {
    console.log(`${event}: ${JSON.stringify(msg)}`)
}

function startAdTimer() {
    setTimeout(() => {
        window.plugins.AdMob.createInterstitialView()
        window.plugins.AdMob.requestInterstitialAd()
    }, adInterval)
}

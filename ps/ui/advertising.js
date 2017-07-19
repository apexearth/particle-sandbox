module.exports = {
    initialize,
    prepareInterstitial: window.plugins.AdMob.createInterstitialView.bind(null, {isTesting: !!process.env.TEST}),
    showInterstitial   : window.plugins.AdMob.requestInterstitialAd.bind(null, {isTesting: !!process.env.TEST}),
}

function initialize() {
    if (window.plugins && window.plugins.AdMob) {
        let ad_units = {
            android: {
                banner      : 'ca-app-pub-6051654262613505/6883951206',		//PUT ADMOB ADCODE HERE
                interstitial: 'ca-app-pub-6051654262613505/2796135609'	//PUT ADMOB ADCODE HERE
            }
        }
        let admobid  = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios

        window.plugins.AdMob.setOptions({
            publisherId     : admobid.banner,
            interstitialAdId: admobid.interstitial,
            adSize          : window.plugins.AdMob.AD_SIZE.SMART_BANNER,	//use SMART_BANNER, BANNER, LARGE_BANNER, IAB_MRECT, IAB_BANNER, IAB_LEADERBOARD
            bannerAtTop     : false, // set to true, to put banner at top
            overlap         : true,  // banner will overlap webview
            offsetTopBar    : false, // set to true to avoid ios7 status bar overlap
            isTesting       : false, // receiving test ad
            autoShow        : false   // auto show interstitial ad when loaded
        })

        registerAdEvents()
    } else {
        console.log('admob plugin not ready')
    }
}
//functions to allow you to know when ads are shown, etc.
function registerAdEvents() {
    document.addEventListener('onReceiveAd', ()=>undefined)
    document.addEventListener('onFailedToReceiveAd', (data)=>undefined)
    document.addEventListener('onPresentAd', ()=>undefined)
    document.addEventListener('onDismissAd', ()=>undefined)
    document.addEventListener('onLeaveToAd', ()=>undefined)
    document.addEventListener('onReceiveInterstitialAd', ()=>undefined)
    document.addEventListener('onPresentInterstitialAd', ()=>undefined)
    document.addEventListener('onDismissInterstitialAd', ()=>undefined)
}

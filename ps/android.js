const state       = require("./ui/state")
const advertising = require('./ui/advertising')

document.addEventListener("deviceready", onDeviceReady, false)

function onDeviceReady() {
    AndroidFullScreen.immersiveMode()
    state.mobile = true

    advertising.initialize()
}

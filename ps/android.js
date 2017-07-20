const state       = require("./ui/state")
const advertising = require('./ui/advertising')

document.addEventListener("deviceready", onDeviceReady, false)

document.addEventListener("pause", () => state.ps.paused = true, false)
document.addEventListener("resume", () => state.ps.paused = false, false)

function onDeviceReady() {
    AndroidFullScreen.immersiveMode()
    state.mobile = true

    advertising.initialize()
}

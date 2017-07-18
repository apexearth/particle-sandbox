const state = require("./ui/state")

document.addEventListener("deviceready", onDeviceReady, false)

function onDeviceReady() {
    AndroidFullScreen.immersiveMode()
    state.mobile = true
}

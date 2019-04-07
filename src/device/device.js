const state = require("../ui/state")

const {deviceType} = state

document.addEventListener("deviceready", onDeviceReady, false)

document.addEventListener("pause", () => state.ps.paused = true, false)
document.addEventListener("resume", () => state.ps.paused = false, false)

function onDeviceReady() {
    if (deviceType === 'android') {
        window.AndroidFullScreen.immersiveMode()
    }
    window.plugins.insomnia.keepAwake()
    state.mobile = true
}

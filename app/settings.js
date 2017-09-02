const browser  = require('./browser')
module.exports = {
    fadeFilterCSS: !browser.explorerOrEdge,
    invertColors : !browser.explorerOrEdge
}
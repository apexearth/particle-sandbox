const {EventEmitter} = require('events')

const state = module.exports = new EventEmitter()

state.initialize = instance => {
    ps = state.ps = instance
}

let ps = state.ps = null

const menu = state.menu = {
    subscribe    : fn => state.on('menu', fn),
    notify       : () => state.emit('menu', menu),
    visible      : true,
    toggleVisible: () => {
        menu.visible = !menu.visible
        menu.notify()
    },
    changeTool   : value => {
        ps.userInput.mode = value
        menu.notify()
    }
}

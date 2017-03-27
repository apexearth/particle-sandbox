const {EventEmitter} = require('events');

const state = module.exports = new EventEmitter();


const menu = state.menu = {
    subscribe    : fn => state.on('menu', fn),
    notify       : () => state.emit('menu', menu),
    visible      : true,
    toggleVisible: () => {
        menu.visible = !menu.visible
        menu.notify()
    }
}

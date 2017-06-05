const {EventEmitter} = require('events')

const state = module.exports = new EventEmitter()
let ps = state.ps = null

state.subscribe = fn => state.on('state', fn)
state.notify    = () => state.emit('state', state)

state.menu       = 'edit'
state.menus      = []
state.toggleMenu = val => {
    if (state.menu === val) state.menu = null
    else state.menu = val
    state.menus.forEach(menu => menu.notify())
}

state.initialize = instance => {
    ps = state.ps = instance
}

const createMenu = (name) => {
    let menu = {
        subscribe    : fn => state.on(name, fn),
        notify       : () => state.emit(name, menu),
        visible      : () => state.menu === name,
        toggleVisible: () => state.toggleMenu(name),
    }
    state.menus.push(menu)
    return menu
}

state.edit            = createMenu('edit')
state.edit.changeTool = value => {
    state.ps.userInput.mode = value
    state.edit.notify()
}

state.settings               = createMenu('settings')
state.settings.changeSection = value => {
    state.settings.section = value
    state.settings.notify()
}

state.explore = createMenu('explore')

const selectionInfo = state.selectionInfo = {
    subscribe: fn => state.on('selectionInfo', fn),
    notify   : () => state.emit('selectionInfo', selectionInfo),
    toggleFollowSelection() {
        ps.modes.followSelection = !ps.modes.followSelection
        state.selectionInfo.notify()
    },
    get followSelection() {
        return ps.modes.followSelection
    }
}

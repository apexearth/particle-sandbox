const {EventEmitter} = require('events')

const state = module.exports = new EventEmitter()
state.subscribe = fn => state.on('state', fn)
state.notify    = () => state.emit('state', edit)

state.menu       = 'edit'
state.toggleMenu = val => {
    if (state.menu === val) state.menu = null
    else state.menu = val
    state.notify()
}

state.initialize = instance => {
    ps = state.ps = instance
}

let ps = state.ps = null

const edit = state.edit = {
    subscribe    : fn => state.on('menu', fn),
    notify       : () => state.emit('menu', edit),
    visible      : () => state.menu === 'edit',
    toggleVisible: () => state.toggleMenu('edit'),
    changeTool   : value => {
        ps.userInput.mode = value
        edit.notify()
    }
}

const selectionInfo = state.selectionInfo = {
    subscribe: fn => state.on('selectionInfo', fn),
    notify   : () => state.emit('selectionInfo', edit),
    toggleFollowSelection() {
        ps.modes.followSelection = !ps.modes.followSelection
        selectionInfo.notify()
    },
    get followSelection() {
        return ps.modes.followSelection
    }
}

const settings = state.settings = {
    subscribe    : fn => state.on('settings', fn),
    notify       : () => state.emit('settings', edit),
    visible      : () => state.menu === 'settings',
    toggleVisible: () => state.toggleMenu('settings'),
    section      : null,
    changeSection: value => {
        settings.section = value
        settings.notify()
    }
}
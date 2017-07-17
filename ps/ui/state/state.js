import analytics from '../analytics'

const {EventEmitter} = require('events')

const state = module.exports = new EventEmitter()
if (typeof window !== 'undefined') {
    window.state = state
}

state.deploymentType = "web"

state.actions = require('./actions')

state.screen = 'StartScreen'

state.subscribe = fn => state.on('state', fn)
state.notify    = () => state.emit('state', state)

state.menu       = 'edit'
state.menus      = []
state.toggleMenu = val => {
    if (state.menu === val) state.menu = null
    else state.menu = val
    state.menus.forEach(menu => menu.notify())
    analytics.event('state', 'toggleMenu', val)
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
    analytics.event('state', 'edit.changeTool', value)
}

state.settings               = createMenu('settings')
state.settings.changeSection = value => {
    state.settings.section = value
    state.settings.notify()
    analytics.event('state', 'settings.changeSection', value)
}

state.explore = createMenu('explore')

const selectionInfo = state.selectionInfo = {
    subscribe: fn => state.on('selectionInfo', fn),
    notify   : () => state.emit('selectionInfo', selectionInfo),
    toggleFollowSelection() {
        state.ps.modes.followSelection = !state.ps.modes.followSelection
        state.selectionInfo.notify()
    },
    get followSelection() {
        return state.ps.modes.followSelection
    }
}


// Init
state.actions.startSandbox(true)
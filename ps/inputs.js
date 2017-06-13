const userInput      = require('user-input')
const Mapping        = require('user-input-mapping')
const {view}         = require('./renderer')

const keyboardTarget = typeof document !== 'undefined' ? document.body : undefined

const inputs = userInput()
    .withMouse(view)
    .withKeyboard(keyboardTarget, {
        afterEvent: (key, event) => {
            // event.preventDefault()
        }
    })

const mapping = new Mapping(
    inputs,
    {
        keyboard: {
            'up'      : ['<up>', 'W'],
            'down'    : ['<down>', 'S'],
            'left'    : ['<left>', 'A'],
            'right'   : ['<right>', 'D'],
            'zoomIn'  : ['=', '<num-+>'],
            'zoomOut' : ['-', '<num-->'],
            'deselect': ['<escape>'],
            'delete'  : ['<backspace>', '<delete>'],
            'shift'   : ['<shift>'],
            'control' : ['<control>'],
            'A'       : 'A'
        },
        mouse   : {
            'mouse0': 'mouse0',
            'mouse1': 'mouse1',
            'mouse2': 'mouse2',
            'mouseX': 'x',
            'mouseY': 'y',
        }
    }, false)

const value    = mapping.value.bind(mapping)
const clear    = mapping.clear.bind(mapping)
const update   = mapping.update.bind(mapping)
value.clear    = clear
value.update   = update
value.mapping  = mapping
module.exports = value

const userInput = require('user-input')
const Mapping   = require('user-input-mapping')

const inputs = userInput()


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

const value            = mapping.value.bind(mapping)
const clear            = mapping.clear.bind(mapping)
const update           = mapping.update.bind(mapping)
module.exports         = value
module.exports.clear   = clear
module.exports.update  = update
module.exports.mapping = mapping
module.exports.inputs  = inputs

let initialized           = false
module.exports.initialize = (view) => {
    inputs
        .withMouse(view)
        .withTouch(view)
    if (!initialized) {
        const keyboardTarget = typeof document !== 'undefined' ? document.body : undefined
        inputs.withKeyboard(keyboardTarget)
    }
    initialized = true
}
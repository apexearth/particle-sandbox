var userInput = require('user-input');
var Mapping = require('user-input-mapping');

var inputs = userInput()
    .withMouse()
    .withKeyboard();

var mapping = new Mapping(
    inputs,
    {
        keyboard: {
            'up': ['<up>', 'W'],
            'down': ['<down>', 'S'],
            'left': ['<left>', 'A'],
            'right': ['<right>', 'D'],
            'zoomIn': ['=', '<num-+>'],
            'zoomOut': ['-', '<num-->']
        },
        mouse: {
            'mouse0': 'mouse0',
            'mouse1': 'mouse1',
            'mouse2': 'mouse2',
            'mouseX': 'x',
            'mouseY': 'y',
        }
    }, false);

var value = mapping.value.bind(mapping);
var clear = mapping.clear.bind(mapping);
var update = mapping.update.bind(mapping);
value.clear = clear;
value.update = update;
value.mapping = mapping;
module.exports = value;

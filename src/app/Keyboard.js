var keyboard = module.exports = {
    keys: []
};

document.onkeydown = function (event) {
    keyboard.keys[event.keyCode] = true;
};
document.onkeyup = function (event) {
    keyboard.keys[event.keyCode] = false;
};

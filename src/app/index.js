var app = require('./ui');

require('./ui');
require('./Atan2');
require('./General');
var Gravity = require('./Gravity');
require('./Keyboard');
require('./Particle');
require('./Quadtree');
require('./Settings');
var Toolbox = require('./Toolbox');

app.run(function () {
    var canvas = document.getElementById("canvas");
    Gravity.initialize(canvas);
    Toolbox.initialize();
    Gravity.setCanvasSize();
    Gravity.clear();
});

var app = require('./ui/Application');

if (!('ontouchstart' in document)) {
    require('./ui/DesktopControllers');
    require('./ui/DesktopEvents');
    require('./ui/DesktopMenu');
}

if ('ontouchstart' in document) {
    require('./ui/MobileControllers');
    require('./ui/MobileEvents');
}

require('./ui/GenerateParticlesMenu');

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
var app = require('./ui');

require('./ui');
require('./Atan2');
require('./General');
var State = require('./State');
require('./Keyboard');
require('./Particle');
require('./Quadtree');
require('./settings');
var Toolbox = require('./Toolbox');

app.run(function () {
    var canvas = document.getElementById("canvas");
    State.initialize(canvas);
    Toolbox.initialize();
});

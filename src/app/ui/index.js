/*@ngInject*/
var app = angular.module("ps.main", [
    'ps.navbar',
    'ps.menus',
    'ui.bootstrap'
]);
module.exports = app;

var Gravity = require('./../Gravity');
var Toolbox = require('./../Toolbox');

require('./navbar/');
require('./menus/');
require('./instance');
require('./GenerateParticlesMenu');

if (!('ontouchstart' in document)) {
    require('./DesktopControllers');
    require('./DesktopEvents');
    require('./DesktopMenu');
}

if ('ontouchstart' in document) {
    require('./MobileControllers');
    require('./MobileEvents');
}

/*@ngInject*/
var app = angular.module("ps.main", [
    'ps.navbar',
    'ps.menus',
    'ui.bootstrap',
    'toastr'
]);
module.exports = app;

require('./navbar/');
require('./menus/');
require('./PS');
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

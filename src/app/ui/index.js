/*@ngInject*/
var app = angular.module("ps.main", [
    'ui.slider',
    'ui.bootstrap',
    'toastr'
]);
module.exports = app;

require('./toastrConfig');
require('./menus/');

if (!('ontouchstart' in document)) {
    require('./DesktopControllers');
    require('./DesktopEvents');
}

if ('ontouchstart' in document) {
    require('./MobileControllers');
    require('./MobileEvents');
}

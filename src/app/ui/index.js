/*@ngInject*/
var app = angular.module("ps.main", [
    'ui.bootstrap',
    'toastr'
]);
module.exports = app;

require('./toastrConfig');
require('./ui');
require('./navbar/');
require('./menus/');

if (!('ontouchstart' in document)) {
    require('./DesktopControllers');
    require('./DesktopEvents');
    require('./DesktopMenu');
}

if ('ontouchstart' in document) {
    require('./MobileControllers');
    require('./MobileEvents');
}

var app = require('../');
var settings = require('../../settings');
var State = require('../../State');
/*@ngInject*/
app.directive('psMenus', function(ui){
    return {
        restrict: 'E',
        templateUrl: 'app/ui/menus/ps-menus.html',
        link: function(scope) {
            scope.ui = ui;
            scope.settings = settings;
            scope.State = settings;
        }
    };
});

var app = require('./');
/*@ngInject*/
app.directive('psMenus', function(){
    return {
        restrict: 'E',
        templateUrl: 'app/ui/menus/menus.html'
    };
});
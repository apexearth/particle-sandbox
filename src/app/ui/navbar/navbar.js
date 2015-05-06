var app = require('./');
/*@ngInject*/
app.directive('psNavbar', function(){
    return {
        restrict: 'E',
        templateUrl: 'app/ui/navbar/navbar.html'
    };
});
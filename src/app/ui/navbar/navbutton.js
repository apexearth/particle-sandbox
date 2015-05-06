var app = require('./');
app.directive('psNavbutton', function(){
    return {
        restrict: 'E',
        templateUrl: 'navbutton.html'
    };
});

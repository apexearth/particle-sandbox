var app = require('../');
var PS = require('../../ParticleSandbox');
var State = require("../../State");
var settings = require("../../settings");

/*@ngInject*/
app.directive('psNavbar', function (toastr) {

    return {
        restrict: 'E',
        templateUrl: 'app/ui/navbar/ps-navbar.html',
        link: function (scope) {
            scope.settings = settings;

            scope.followLargest = function () {
                State.toggleFollowLargest();
            };

        }
    };
});


var app = require('../');
var PS = require('../../ParticleSandbox');
var State = require("../../State");
var settings = require("../../settings");

/*@ngInject*/
app.directive('psNavbar', function (ui, toastr) {

    return {
        restrict: 'E',
        templateUrl: 'app/ui/navbar/ps-navbar.html',
        link: function (scope) {
            scope.ui = ui;
            scope.settings = settings;
            scope.newInstance = function () {
                State.newInstance();
                toastr.success("Started a new instance!");
            };
            scope.togglePause = function () {
                settings.paused = !settings.paused;
            };

            scope.followLargest = function () {
                State.toggleFollowLargest();
            };

            scope.exportFile = function () {
                var gravityInstance = State.getInstanceJson();
                if (gravityInstance != null) {
                    var uriContent = "data:application/octet-stream," + encodeURIComponent(gravityInstance);
                    window.open(uriContent, 'particlesandbox.json');
                }
            };


            scope.isActive = function(value){
                return value ? "active" : "";
            };
            updateNavbar();
        }
    };
});

function updateNavbar() {
    $('#fps').html(PS.instance.frameRate + " fps");
    $('#cap').html((PS.instance.processingTime / 10).toFixed(1) + "%");
    $('#particleCount').html(PS.particleCount());
    setTimeout(function () {updateNavbar();}, 100);
}

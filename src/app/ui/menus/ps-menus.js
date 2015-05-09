var Guid = require('Guid');

var app = require('../');
var settings = require('../../settings');
var State = require('../../State');
/*@ngInject*/
app.directive('psMenus', function (ui, toastr) {
    return {
        restrict: 'E',
        templateUrl: 'app/ui/menus/ps-menus.html',
        link: function (scope) {
            scope.ui = ui;
            scope.settings = settings;
            scope.State = settings;

            scope.trailType = "2";
            scope.setTrailType = function () {
                settings.trailType = Number(scope.trailType);
            };


            // Gravity
            scope.gravityProportion = 1;
            scope.gravityExponential = 1;
            scope.gravityChanged = function () {
                settings.gravityProportion = scope.gravityProportion * scope.gravityExponential * scope.gravityExponential + 0.01;
                settings.gravityExponential = scope.gravityExponential;
            };

            // Load / Save
            scope.saveName = null;
            scope.save = function () {
                if (scope.saveName === null || scope.saveName.length === 0) return;
                if (State.save(scope.saveName)) {
                    scope.loadSaveList = State.getSaveList();
                    scope.loadSaveName = scope.saveName;
                    toastr.success('Save successful');
                } else {
                    toastr.error('Save failed! Sorry :(');
                }
                ui.show('none');
            };

            scope.loadSaveList = State.getSaveList();
            scope.loadSaveName = scope.loadSaveList[0];
            scope.loadSave = function () {
                if (scope.saveName === null || scope.saveName.length === 0) return;
                if (State.loadSave(scope.loadSaveName)) {
                    scope.saveName = scope.loadSaveName;
                    ui.show('none');
                    toastr.success('Load successful');
                } else {
                    ui.show('none');
                    toastr.error('Load failed! Sorry :(');
                }
            };

            scope.downloadImage = function () {
                if (window.bowser.msie) {
                    toastr.error('Unsupported by Internet Explorer');
                    return;
                }

                var image = State.getImage();
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = image;
                a.download = 'particleSandbox.png';
                a.click();
                document.body.removeChild(a);
            };
        }
    };
});

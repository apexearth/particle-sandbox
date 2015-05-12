var State = require('../../State');
var settings = require('../../settings');

var app = require('../');

/*@ngInject*/
app.directive('psMenus', function (ui, toastr) {
    return {
        restrict: 'E',
        templateUrl: 'app/ui/menus/ps-menus.html',
        link: function PsMenus(ui, toastr, scope) {
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
                settings.gravityProportion = 0.001 + scope.gravityProportion * scope.gravityExponential * scope.gravityExponential;
                settings.gravityExponential = scope.gravityExponential;
            };
            scope.gravityUpdateFromSettings = function () {
                scope.gravityProportion = settings.gravityProportion / settings.gravityExponential / settings.gravityExponential - 0.001;
                scope.gravityExponential = settings.gravityExponential;
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
                if (scope.loadSaveName === null || scope.loadSaveName.length === 0) return;
                if (State.loadSave(scope.loadSaveName)) {
                    scope.gravityUpdateFromSettings();
                    scope.saveName = scope.loadSaveName;
                    ui.show('none');
                    toastr.success('Load successful');
                } else {
                    ui.show('none');
                    toastr.error('Load failed! Sorry :(');
                }
            };

            scope.deleteSave = function () {
                if (State.deleteSave(scope.loadSaveName)) {
                    toastr.success(scope.loadSaveName + ' deleted');
                    scope.loadSaveList = State.getSaveList();
                    scope.loadSaveName = scope.loadSaveList[0];
                } else {
                    toastr.error('Delete failed! Sorry :(');
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


            scope.isButtonActive = function (value) {
                return value
                    ? "btn btn-success"
                    : "btn btn-danger";
            };
        }
    };

});


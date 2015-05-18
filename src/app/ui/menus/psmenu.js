var PS = require('../../ParticleSandbox');
var State = require('../../State');
var settings = require('../../settings');

var app = require('../');

var menuState = {
    view: 'none'
};

/*@ngInject*/
app.directive('psmenu', function (toastr) {
    return {
        restrict: 'E',
        templateUrl: 'app/ui/menus/psmenu.html',
        scope: {},
        controller: function PsMenus($scope) {
            $scope.settings = settings;
            $scope.State = settings;

            $scope.show = function (val) {
                if (val === menuState.view) {
                    menuState.view = 'none';
                }
                else if (val) {
                    menuState.view = val;
                }
                else return menuState.view;
            };
            $scope.view = $scope.show;

            $scope.trailType = "2";
            $scope.setTrailType = function () {
                settings.trailType = Number($scope.trailType);
            };


            // Gravity
            $scope.gravityProportion = 1;
            $scope.gravityExponential = 1;
            $scope.gravityChanged = function () {
                settings.gravityProportion = 0.001 + $scope.gravityProportion * $scope.gravityExponential * $scope.gravityExponential;
                settings.gravityExponential = $scope.gravityExponential;
            };
            $scope.gravityUpdateFromSettings = function () {
                $scope.gravityProportion = settings.gravityProportion / settings.gravityExponential / settings.gravityExponential - 0.001;
                $scope.gravityExponential = settings.gravityExponential;
            };

            // New / Load / Save
            $scope.newInstance = function () {
                State.newInstance();
                toastr.success("Started a new instance!");
            };

            $scope.saveName = null;
            $scope.save = function () {
                if ($scope.saveName === null || $scope.saveName.length === 0) return;
                if (State.save($scope.saveName)) {
                    $scope.loadSaveList = State.getSaveList();
                    $scope.loadSaveName = $scope.saveName;
                    toastr.success('Save successful');
                } else {
                    toastr.error('Save failed! Sorry :(');
                }
                $scope.show('none');
            };

            $scope.loadSaveList = State.getSaveList();
            $scope.loadSaveName = $scope.loadSaveList[0];
            $scope.loadSave = function () {
                if ($scope.loadSaveName === null || $scope.loadSaveName.length === 0) return;
                if (State.loadSave($scope.loadSaveName)) {
                    $scope.gravityUpdateFromSettings();
                    $scope.saveName = $scope.loadSaveName;
                    $scope.show('none');
                    toastr.success('Load successful');
                } else {
                    $scope.show('none');
                    toastr.error('Load failed! Sorry :(');
                }
            };

            $scope.deleteSave = function () {
                if (State.deleteSave($scope.loadSaveName)) {
                    toastr.success($scope.loadSaveName + ' deleted');
                    $scope.loadSaveList = State.getSaveList();
                    $scope.loadSaveName = $scope.loadSaveList[0];
                } else {
                    toastr.error('Delete failed! Sorry :(');
                }
            };

            $scope.downloadImage = function () {
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

            $scope.exportFile = function () {
                var gravityInstance = State.getInstanceJson();
                if (gravityInstance != null) {
                    var uriContent = "data:application/octet-stream," + encodeURIComponent(gravityInstance);
                    window.open(uriContent, 'particlesandbox.json');
                }
            };


            $scope.isButtonActive = function (value) {
                return value
                    ? "btn btn-success"
                    : "btn btn-danger";
            };

            $scope.isMenuActive = true;

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

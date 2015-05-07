var app = require('../');
var State = require("../../State");
var settings = require("../../settings");

/*@ngInject*/
app.directive('psNavbar', function (toastr, ui) {
    return {
        restrict: 'E',
        templateUrl: 'app/ui/navbar/ps-navbar.html',
        link: function (scope) {
            scope.ui = ui;
            scope.settings = settings;
            scope.togglePause = function() {
                settings.paused = !settings.paused;
            };
            scope.newInstance = function () {
                toastr.info("Started a new instance!");
                State.newInstance();
            };
            scope.load = function () {
                if (State.loadInstance($("#pop-load-name").val()))
                    toastr.success("Load successful.");
                else
                    toastr.error("Error", "Load failed.");
                $('#pop-load').hide();
            };
            scope.deleteSave = function () {
                if (State.deleteSave($("#pop-load-name").val()))
                    toastr.success("Deletion successful.");
                else
                    toastr.error("Deletion failed.");
                $('#pop-load-delete-confirm').hide();
                $('#pop-load').hide();
            };
            scope.save = function () {
                if (State.save($("#pop-save-name").val()))
                    toastr.success("Save successful.");
                else
                    toastr.error("Save failed.");
                $("#pop-save").hide();
            };
            scope.showPopLoad = function () {
                var options = "";
                var list = State.getSaveList();
                var i = list.length;
                if (i === 0) {
                    toastr.success("There are currently no saves.");
                    return;
                }
                while (i--) {
                    options += '<option>' + list[i] + '</option>';
                }
                $('#pop-load-name').html(options);
                $('#pop-load').show();
            };
            scope.exportFile = function () {
                var gravityInstance = State.getJson();
                if (gravityInstance != null) {
                    var uriContent = "data:application/octet-stream," + encodeURIComponent(gravityInstance);
                    window.open(uriContent, 'particlesandbox.json');
                }
            };
        }
    };
});



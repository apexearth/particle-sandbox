var app = require('./');
var State = require("../../State");
/*@ngInject*/
app.directive('psNavbar', function (toastr, PS) {
    return {
        restrict: 'E',
        templateUrl: 'app/ui/navbar/ps-navbar.html',
        scope: {},
        controller: function () {
            var vm = this;
            vm.load = function () {
                if (State.loadInstance($("#pop-load-name").val()))
                    toastr.success("Success", "Load successful.");
                else
                    toastr.error("Error", "Load failed.");
                $('#pop-load').hide();
            };
            vm.deleteSave = function () {
                if (State.deleteSave($("#pop-load-name").val()))
                    toastr.success("Success", "Deletion successful.");
                else
                    toastr.error("Error", "Deletion failed.");
                $('#pop-load-delete-confirm').hide();
                $('#pop-load').hide();
            };
            vm.save = function () {
                if (State.save($("#pop-save-name").val()))
                    toastr.success("Success", "Save successful.");
                else
                    toastr.error("Error", "Save failed.");
                $("#pop-save").hide();
            };
            vm.showPopLoad = function () {
                var options = "";
                var list = State.getSaveList();
                var i = list.length;
                if (i === 0) {
                    toastr.success("Success", "There are currently no saves.");
                    return;
                }
                while (i--) {
                    options += '<option>' + list[i] + '</option>';
                }
                $('#pop-load-name').html(options);
                $('#pop-load').show();
            };

            vm.exportFile = function () {
                var gravityInstance = State.getJson();
                if (gravityInstance != null) {
                    var uriContent = "data:application/octet-stream," + encodeURIComponent(gravityInstance);
                    window.open(uriContent, 'particlesandbox.json');
                }
            };
        }
    };
});



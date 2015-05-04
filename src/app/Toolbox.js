var Gravity = require("./Gravity");
var settings = require("./Settings");
module.exports = Toolbox;
function Toolbox() { }

Toolbox.initialize = function () {
    Toolbox.initializeFunctions();
};

Toolbox.initializeFunctions = function () {
    var $toolbar = $('#ps-toolbar');
    $toolbar.mouseleave(function () {
        $('#ps-toolbar').delay(500).animate({
            left: -110,
            borderRightColor: "#334"
        }, 200);
    });

    $toolbar.mouseenter(function () {
        $('#ps-toolbar').clearQueue().animate({
            left: 0,
            borderRightColor: "rgba(0, 0, 0, 0)"
        }, 200);
    });

    $toolbar.find('div').click(function () {
        if ($(this).hasClass('active'))
            $(this).removeClass('active').siblings().addClass('active');
        else
            $(this).addClass('active').siblings().removeClass('active');
    });

    $('#ps-toolbar-momentum').click(function () { settings.momentumAdd = !settings.momentumAdd; });
};
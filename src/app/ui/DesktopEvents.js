var Gravity = require('./../Gravity');
var Events = require('../Events');

Events.addListener('Gravity.initialize', function () {
    var $menu = $(".menu");

    Gravity.canvasdisplay.onclick = function (event) {
        if ($menu.is(":visible")) {
            $menu.filter(":visible").slideToggle(150);
            return false;
        }
        return false;
    };

    Gravity.canvasdisplay.onmousedown = function (event) {
        if ($(".menu").is(":visible")) return false;
        if (event.button !== 0) {
            Gravity.instance.panning = true;
            Gravity.instance.px = event.clientX;
            Gravity.instance.py = event.clientY;
        } else if (event.button === 0) {
            Gravity.UI.unitPlacementStartX = event.clientX;
            Gravity.UI.unitPlacementStartY = event.clientY;
        }
        return false;
    };

    Gravity.canvasdisplay.onmouseup = function (event) {
        if (event.button !== 0)
            Gravity.instance.panning = false;

        else if (event.button === 0) {
            Events.emit('AddParticle', {
                x: event.clientX,
                y: event.clientY
            });
        }
    };

    Gravity.canvasdisplay.onmousemove = function (event) {
        if (Gravity.instance.panning === true) {
            Gravity.instance.drawOffsetXT -= (Gravity.instance.px - event.clientX) / Gravity.instance.drawScale;
            Gravity.instance.drawOffsetYT -= (Gravity.instance.py - event.clientY) / Gravity.instance.drawScale;
            Gravity.instance.px = event.clientX;
            Gravity.instance.py = event.clientY;
        }
        Gravity.UI.mouseX = event.clientX;
        Gravity.UI.mouseY = event.clientY;
    };

    Gravity.canvasdisplay.oncontextmenu = Gravity.canvasdisplay.ondblclick = function () {
        window.focus();
        return false;
    };

    document.onmousedown = function () {
        window.focus();
    };

    function scroll(event) {
        if (event.wheelDelta > 0 || event.detail < 0) {
            Gravity.instance.drawOffsetXT += (Gravity.instance.centerX - event.clientX) * 0.1 / Gravity.instance.drawScale;
            Gravity.instance.drawOffsetYT += (Gravity.instance.centerY - event.clientY) * 0.1 / Gravity.instance.drawScale;
            Gravity.zoomIn();
        } else {
            Gravity.instance.drawOffsetXT += (Gravity.instance.centerX - event.clientX) * 0.1 / Gravity.instance.drawScale;
            Gravity.instance.drawOffsetYT += (Gravity.instance.centerY - event.clientY) * 0.1 / Gravity.instance.drawScale;
            Gravity.zoomOut();
        }
    }
    if (window.chrome) {
        document.onmousewheel = scroll;
    }
    if (document.attachEvent)
        document.attachEvent("onmousewheel", scroll);
    else
        window.addEventListener("DOMMouseScroll", scroll, false);

});
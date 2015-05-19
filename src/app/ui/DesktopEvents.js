var PS = require('./../ParticleSandbox');
var Events = require('../Events');

Events.addListener('PS.initialize', function () {

    PS.canvasdisplay.onmousedown = function (event) {
        if ($(".menu").is(":visible")) return false;
        if (event.button !== 0) {
            PS.instance.panning = true;
            PS.instance.px = event.clientX;
            PS.instance.py = event.clientY;
        } else if (event.button === 0) {
            PS.UI.unitPlacementStartX = event.clientX;
            PS.UI.unitPlacementStartY = event.clientY;
        }
        return false;
    };

    PS.canvasdisplay.onmouseup = function (event) {
        if (event.button !== 0)
            PS.instance.panning = false;

        else if (event.button === 0) {
            Events.emit('AddParticle', {
                x: event.clientX,
                y: event.clientY
            });
        }
    };

    PS.canvasdisplay.onmousemove = function (event) {
        if (PS.instance.panning === true) {
            PS.instance.drawOffsetXT -= (PS.instance.px - event.clientX) / PS.instance.drawScale;
            PS.instance.drawOffsetYT -= (PS.instance.py - event.clientY) / PS.instance.drawScale;
            PS.instance.px = event.clientX;
            PS.instance.py = event.clientY;
        }
        PS.UI.mouseX = event.clientX;
        PS.UI.mouseY = event.clientY;
    };

    PS.canvasdisplay.oncontextmenu = PS.canvasdisplay.ondblclick = function () {
        window.focus();
        return false;
    };

    document.onmousedown = function () {
        window.focus();
    };

    function scroll(event) {
        if (event.wheelDelta > 0 || event.detail < 0) {
            PS.instance.drawOffsetXT += (PS.instance.centerX - event.clientX) * 0.1 / PS.instance.drawScale;
            PS.instance.drawOffsetYT += (PS.instance.centerY - event.clientY) * 0.1 / PS.instance.drawScale;
            PS.zoomIn();
        } else {
            PS.instance.drawOffsetXT += (PS.instance.centerX - event.clientX) * 0.1 / PS.instance.drawScale;
            PS.instance.drawOffsetYT += (PS.instance.centerY - event.clientY) * 0.1 / PS.instance.drawScale;
            PS.zoomOut();
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
var Gravity = require('./../Gravity');
var General = require('./../General');
var Events = require('../Events');

var events = {};

events.Touch = {
    lastTouches: [],
    touches: [],
    lastChangedTouches: [],
    changedTouches: [],
    lastSpacing: 0,
    spacing: 0,
    pageAverageX: 0,
    pageAverageY: 0,
    lastPageAverageX: 0,
    lastPageAverageY: 0,

    process: function (event) {
        this.lastTouches = this.touches;
        this.lastChangedTouches = this.changedTouches;
        this.touches = event.touches;
        this.changedTouches = event.changedTouches;
        this.lastSpacing = this.spacing;
        this.lastPageAverageX = this.pageAverageX;
        this.lastPageAverageY = this.pageAverageY;
        this.calculate();
    },
    calculate: function () {
        this.spacing = 0;
        this.pageAverageX = 0;
        this.pageAverageY = 0;
        if (this.touches.length === 2) {
            var touchI = this.touches[0];
            var touchK = this.touches[1];
            this.spacing = Math.max(this.spacing,
                General.distance(touchI.pageX - touchK.pageX, touchI.pageY - touchK.pageY));
        }
        for (var i = 0; i < this.touches.length; i++) {
            var touch = this.touches[i];
            this.pageAverageX += touch.pageX;
            this.pageAverageY += touch.pageY;
        }
        this.pageAverageX /= this.touches.length;
        this.pageAverageY /= this.touches.length;
    }
};

Events.addListener('Gravity.initialize', function () {
    Gravity.canvasdisplay.addEventListener('touchend', function (event) {
        events.Touch.process(event);
        if (event.changedTouches.length === 1
            && event.touches.length === 0) {
            var touch = event.changedTouches[0];
            Events.emit('AddParticle', {
                x: touch.pageX,
                y: touch.pageY
            });
        }
        return false;
    });
    Gravity.canvasdisplay.addEventListener('touchstart', function (event) {
        events.Touch.process(event);
        if (event.touches.length === 1) {
            var touch = event.touches[0];
            Gravity.UI.unitPlacementStartX = touch.pageX;
            Gravity.UI.unitPlacementStartY = touch.pageY;
        }
        else if (event.touches.length > 1) {
            Gravity.UI.unitPlacementStartX = null;
            Gravity.UI.unitPlacementStartY = null;
        }
        return false;
    });

    Gravity.canvasdisplay.addEventListener('touchmove', function (event) {
        events.Touch.process(event);
        if (event.touches.length === 2) {
            if (events.Touch.spacing !== events.Touch.lastSpacing) {
                var zoomSpeed = (events.Touch.spacing - events.Touch.lastSpacing) / 30;
                Gravity.zoom(zoomSpeed);
                var changeAverageX = events.Touch.pageAverageX - events.Touch.lastPageAverageX;
                var changeAverageY = events.Touch.pageAverageY - events.Touch.lastPageAverageY;
                Gravity.pan(changeAverageX, changeAverageY);
            }
        }
        return false;
    });

    document.onmousedown = document.click = document.dblclick = function () {
        return false;
    };
});

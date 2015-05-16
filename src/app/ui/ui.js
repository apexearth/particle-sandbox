var app = require('./');
var settings = require('../settings');
var state = {
    view: 'none'
};

app.factory('ui', function (toastr) {
    var ui = {};

    var lastSeenPaused = false;
    ui.show = function (val) {
        if (state.view === 'none' && val === 'none') {
            lastSeenPaused = settings.paused;
        }
        else if (val === state.view) {
            state.view = 'none';
            settings.paused = lastSeenPaused;
        }
        else if (val) {
            state.view = val;
            lastSeenPaused = settings.paused;
            settings.paused = lastSeenPaused || state.view !== 'none';
        }
        else return state.view;
    };
    ui.view = ui.show;

    return ui;
});

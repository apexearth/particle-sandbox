var app = require('./');
var settings = require('../settings');
var state = {
    view: 'none'
};

app.factory('ui', function (toastr) {
    var ui = {};

    ui.show = function (val) {
        if(val === state.view) {
            state.view = 'none';
            settings.paused = false;
        }
        else if (val) {
            state.view = val;
            settings.paused = state.view !== 'none';
        }
        else return state.view;
    };
    ui.view = ui.show;

    return ui;
});

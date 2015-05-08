var app = require('./');
var state = {
    view: 'none'
};

app.factory('ui', function (toastr) {
    var ui = {};

    ui.show = function (val) {
        if(val === state.view) state.view = 'none';
        else if (val) state.view = val;
        else return state.view;
    };
    ui.view = ui.show;

    return ui;
});
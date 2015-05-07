var app = require('./');
var state = {
    view: null
};

app.factory('ui', function (toastr) {
    var ui = {};
    ui.show = function (val) {
        if (val) state.view = val;
        else return state.view;
        toastr.info("ui.show = " + state.view);
    };
    ui.view = ui.show;
    return ui;
});
var app = require("./");
var Gravity = require("../Gravity");
/*@ngInject*/
app.factory('instance', function() {
    return Gravity.instance;
});

var app = require("./Application");
var Gravity = require("../Gravity");
/*@ngInject*/
app.factory('instance', function() {
    return Gravity.instance;
});
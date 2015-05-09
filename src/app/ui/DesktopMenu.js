var settings = require('./../settings');
var General = require('./../General');
var PS = require('./../ParticleSandbox');
var Events = require('../Events');

var Menu = {};
module.exports = Menu;

Events.addListener('Gravity.initialize', function () {
    Menu.update();
});

Menu.update = function () {
};

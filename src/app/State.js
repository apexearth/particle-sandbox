var PS = require('./ParticleSandbox');
var Quadtree = require('./Quadtree');
var Events = require('./Events');
module.exports = {
    newInstance: newInstance,
    loadInstance: loadInstance,
    deleteSave: deleteSave,
    validateName: validateName,
    save: save,
    getImage: getImage,
    getSaveList: getSaveList,
    addToSaveList: addToSaveList,
    removeFromSaveList: removeFromSaveList,
    getJson: getJson,
    initialize: initialize,
    setInstance: setInstance
};

function newInstance() {
    delete PS.instance;
    setInstance(new PS());
    Quadtree.initializeQuadtree(PS.instance);
}

function loadInstance(name) {
    name = PS.validateName(name);
    if (name.length === 0) return false;
    var gravityInstanceJSON = localStorage.getItem("gravityinstance" + name);
    if (gravityInstanceJSON != null) {
        var gravityInstance = JSON.parse(gravityInstanceJSON);
        if (gravityInstance != null) {
            delete PS.instance;
            setInstance(gravityInstance);
            Quadtree.initializeQuadtree(PS.instance);
            PS.clear();
            return true;
        }
    }
    return false;
}
function deleteSave(name) {
    name = PS.validateName(name);
    if (name.length === 0) return false;
    localStorage.removeItem("gravityinstance" + name);
    PS.removeFromSaveList(name);
    return true;
}
function save(name) {
    name = PS.validateName(name);
    if (name.length === 0) return false;
    Quadtree.clear(PS.instance);
    var gravityInstanceJSON = JSON.stringify(PS.instance);
    if (gravityInstanceJSON != null) {
        localStorage.setItem("gravityinstance" + name, gravityInstanceJSON);
        PS.addToSaveList(name);
        var gravityInstanceCompare = localStorage.getItem("gravityinstance" + name);
        if (gravityInstanceCompare === gravityInstanceJSON) {
            Quadtree.initializeQuadtree(PS.instance);
            return true;
        }
    }
    Quadtree.initializeQuadtree(PS.instance);
    return false;
}
function validateName(name) {
    if (name == null) return "";
    var result = "", match, regex = new RegExp("[a-zA-Z0-9]+");
    match = regex.exec(name);
    while (match != null) {
        result += match;
        name = name.substring(match.index + match[0].length);
        match = regex.exec(name);
    }
    return result;
}
function getImage() {
    return PS.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}
function getSaveList() {
    var saveListString = localStorage.getItem("saveList");
    if (saveListString == null) {
        return [];
    }
    return JSON.parse(saveListString);
}
function addToSaveList(name) {
    var saveList = getSaveList();
    if (saveList.indexOf(name) === -1) saveList.push(name);
    localStorage.setItem("saveList", JSON.stringify(saveList));
}
function removeFromSaveList(name) {
    var saveList = getSaveList();
    if (saveList.indexOf(name) !== -1) saveList.splice(saveList.indexOf(name), 1);
    localStorage.setItem("saveList", JSON.stringify(saveList));
}
function getJson() {
    return JSON.stringify(PS.instance);
}

function initialize(canvasdisplay) {
    PS.canvasdisplay = canvasdisplay;
    PS.contextdisplay = PS.canvasdisplay.getContext("2d");
    PS.canvas = document.createElement('canvas');
    PS.canvasui = document.createElement('canvas');
    PS.context = PS.canvas.getContext("2d");
    PS.contextui = PS.canvasui.getContext("2d");
    setInstance(new PS());
    Quadtree.initializeQuadtree(PS.instance);

    window.onresize = function () { PS.setCanvasSize(); };
    PS.setCanvasSize();
    PS.beginUpdateTimer();
    PS.beginDrawTimer();

    for (var i = 0; i < 500 * (1 + 10 * Math.random()); i++) {
        PS.addParticle(
            (Math.random() * PS.canvas.width - PS.instance.centerX) / PS.instance.drawScale - PS.instance.drawOffsetX,
            (Math.random() * PS.canvas.height - PS.instance.centerY) / PS.instance.drawScale - PS.instance.drawOffsetY,
            0,
            0,
            10);
    }
    PS.setCanvasSize();
    PS.clear();

    Events.emit('Gravity.initialize');
}

function setInstance(gravity) {
    PS.instance = gravity;
    Events.emit('Gravity.create');
}
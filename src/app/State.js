var PS = require('./ParticleSandbox');
var Quadtree = require('./Quadtree');
var Events = require('./Events');
var settings = require('./settings');

module.exports = {
    newInstance: newInstance,
    loadSave: loadSave,
    deleteSave: deleteSave,
    save: save,
    getImage: getImage,
    getSaveList: getSaveList,
    addToSaveList: addToSaveList,
    removeFromSaveList: removeFromSaveList,
    getInstanceJson: getInstanceJson,
    initialize: initialize,
    setInstance: setInstance,
    toggleFollowLargest: toggleFollowLargest
};

function newInstance() {
    PS.clear();
    delete PS.instance;
    setInstance(new PS());
    Quadtree.initializeQuadtree(PS.instance);
}
function loadSave(name) {
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
    if (name.length === 0) return false;
    localStorage.removeItem("gravityinstance" + name);
    PS.removeFromSaveList(name);
    return true;
}
function save(name) {
    if (name.length === 0) return false;
    Quadtree.clear(PS.instance);
    var gravityInstanceJSON = JSON.stringify(PS.instance);
    if (gravityInstanceJSON != null) {
        localStorage.setItem("gravityinstance" + name, gravityInstanceJSON);
        addToSaveList(name);
        var gravityInstanceCompare = localStorage.getItem("gravityinstance" + name);
        if (gravityInstanceCompare === gravityInstanceJSON) {
            Quadtree.initializeQuadtree(PS.instance);
            return true;
        }
    }
    Quadtree.initializeQuadtree(PS.instance);
    return false;
}
function getImage() {
    return PS.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}
function getSaveList() {
    var saveListString = localStorage.getItem("saveList");
    if (saveListString == null) {
        return [];
    }
    var saveList = JSON.parse(saveListString).map(function(save){
        return save;
    });
    return saveList;
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
function getInstanceJson() {
    return JSON.stringify(PS.instance);
}

function toggleFollowLargest() {
    settings.followLargest = !settings.followLargest;
    if(settings.followLargest) {
        PS.clear();
    }
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
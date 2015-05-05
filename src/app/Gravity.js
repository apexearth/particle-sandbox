var Events = require('./Events');
var Quadtree = require('./Quadtree');
var Particle = require('./Particle');
var Keyboard = require('./Keyboard');
var settings = require("./Settings");
module.exports = Gravity;

Gravity.instance = {};
Gravity.setInstance = function (gravity) {
    Gravity.instance = gravity;
    Events.emit('Gravity.create');
};
Gravity.initialize = function (canvasdisplay) {
    Gravity.canvasdisplay = canvasdisplay;
    Gravity.contextdisplay = Gravity.canvasdisplay.getContext("2d");
    Gravity.canvas = document.createElement('canvas');
    Gravity.canvasui = document.createElement('canvas');
    Gravity.context = Gravity.canvas.getContext("2d");
    Gravity.contextui = Gravity.canvasui.getContext("2d");
    Gravity.setInstance(new Gravity());
    Quadtree.initializeQuadtree(Gravity.instance);

    window.onresize = function () { Gravity.setCanvasSize(); };
    Gravity.setCanvasSize();
    Gravity.beginUpdateTimer();
    Gravity.beginDrawTimer();

    for (var i = 0; i < 500 * (1 + 10 * Math.random()); i++) {
        Gravity.addParticle(
            (Math.random() * Gravity.canvas.width - Gravity.instance.centerX) / Gravity.instance.drawScale - Gravity.instance.drawOffsetX,
            (Math.random() * Gravity.canvas.height - Gravity.instance.centerY) / Gravity.instance.drawScale - Gravity.instance.drawOffsetY,
            0,
            0,
            10);
    }
    Events.emit('Gravity.initialize');
};
Events.addListener('AddParticle', function (coords) {
    if (Gravity.UI.unitPlacementStartX == null) return;
    var momentumX = 0;
    var momentumY = 0;
    if (settings.momentumAdd) {
        momentumX = (Gravity.UI.unitPlacementStartX - coords.x) / 60 / Gravity.instance.drawScale;
        momentumY = (Gravity.UI.unitPlacementStartY - coords.y) / 60 / Gravity.instance.drawScale;
    }
    Gravity.addParticle(
        (Gravity.UI.unitPlacementStartX - Gravity.instance.centerX) / Gravity.instance.drawScale - Gravity.instance.drawOffsetX,
        (Gravity.UI.unitPlacementStartY - Gravity.instance.centerY) / Gravity.instance.drawScale - Gravity.instance.drawOffsetY,
        momentumX,
        momentumY,
        10);
    Gravity.UI.unitPlacementStartX = null;
    Gravity.UI.unitPlacementStartY = null;
});

function Gravity() {
    this.centerX = 400;
    this.centerY = 300;
    this.drawOffsetX = 0;
    this.drawOffsetY = 0;
    this.drawScale = 0.5;
    this.drawOffsetXT = 0;
    this.drawOffsetYT = 0;
    this.drawScaleT = 0.5;
    this.totalMass = 0;
    this.particles = [];
    this.panning = false;

    this.drawTrailCount = 0;
    this.frameCount = 0;
    this.frameRate = 0;
    this.frameLag = 0;
    this.lastFrame = Date.now();
    this.lastFrameReset = Date.now();
    this.processingCount = 0;
    this.processingTime = 0;
    this.processingStart = Date.now();

    this.generateParticleRateCount = 0;

    //Settings
    this.Settings = settings;
    this.largestParticleIndex = 0;
}

Gravity.UI = function () {
    this.unitPlacementStartX = null;
    this.unitPlacementStartY = null;
    this.mouseX = null;
    this.mouseY = null;
};
Gravity.newInstance = function () {
    delete Gravity.instance;
    Gravity.setInstance(new Gravity());
    Quadtree.initializeQuadtree(Gravity.instance);
};
Gravity.loadInstance = function (name) {
    name = Gravity.validateName(name);
    if (name.length === 0) return false;
    var gravityInstanceJSON = localStorage.getItem("gravityinstance" + name);
    if (gravityInstanceJSON != null) {
        var gravityInstance = JSON.parse(gravityInstanceJSON);
        if (gravityInstance != null) {
            delete Gravity.instance;
            Gravity.setInstance(gravityInstance);
            Quadtree.initializeQuadtree(Gravity.instance);
            Gravity.clear();
            return true;
        }
    }
    return false;
};
Gravity.deleteSave = function (name) {
    name = Gravity.validateName(name);
    if (name.length === 0) return false;
    localStorage.removeItem("gravityinstance" + name);
    Gravity.removeFromSaveList(name);
    return true;
};
Gravity.validateName = function (name) {
    if (name == null) return "";
    var result = "", match, regex = new RegExp("[a-zA-Z0-9]+");
    match = regex.exec(name);
    while (match != null) {
        result += match;
        name = name.substring(match.index + match[0].length);
        match = regex.exec(name);
    }
    return result;
};
Gravity.save = function (name) {
    name = Gravity.validateName(name);
    if (name.length === 0) return false;
    Quadtree.clear(Gravity.instance);
    var gravityInstanceJSON = JSON.stringify(Gravity.instance);
    if (gravityInstanceJSON != null) {
        localStorage.setItem("gravityinstance" + name, gravityInstanceJSON);
        Gravity.addToSaveList(name);
        var gravityInstanceCompare = localStorage.getItem("gravityinstance" + name);
        if (gravityInstanceCompare === gravityInstanceJSON) {
            Quadtree.initializeQuadtree(Gravity.instance);
            return true;
        }
    }
    Quadtree.initializeQuadtree(Gravity.instance);
    return false;
};
Gravity.getSaveList = function () {
    var saveListString = localStorage.getItem("saveList");
    if (saveListString == null) {
        return [];
    }
    return JSON.parse(saveListString);
};
Gravity.addToSaveList = function (name) {
    var saveList = Gravity.getSaveList();
    if (saveList.indexOf(name) === -1) saveList.push(name);
    localStorage.setItem("saveList", JSON.stringify(saveList));
};
Gravity.removeFromSaveList = function (name) {
    var saveList = Gravity.getSaveList();
    if (saveList.indexOf(name) !== -1) saveList.splice(saveList.indexOf(name), 1);
    localStorage.setItem("saveList", JSON.stringify(saveList));
};
Gravity.getImage = function () {
    return Gravity.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
};

Gravity.beginUpdateTimer = function () {
    setTimeout(function () {Gravity.update();}, 1000 / Gravity.instance.Settings.fpsTarget);
};
Gravity.beginDrawTimer = function () {
    setTimeout(function () {Gravity.draw();}, 33);
};
Gravity.setCenterXY = function () {
    Gravity.instance.centerX = Gravity.canvas.width / 2;
    Gravity.instance.centerY = Gravity.canvas.height / 2;
};
Gravity.update = function () {
    Gravity.beginUpdateTimer();
    if (Gravity.instance == null) return;
    if (Gravity.instance.Settings.paused) return;

    Gravity.startUpdateStatistics();
    var i;
    for (i = 0; i < Gravity.instance.particles.length; i++)
        Particle.update(Gravity.instance.particles[i]);

    Quadtree.updateRoot(Particle);

    for (i = Gravity.instance.particles.length - 1; i >= 0; i--)
        Particle.updateInteract(Gravity.instance.particles[i]);

    var largestParticle = Gravity.largestParticle();

    Gravity.instance.totalMass = 0;
    var particle;
    for (i = Gravity.instance.particles.length - 1; i >= 0; i--) {
        particle = Gravity.instance.particles[i];
        if (particle.mass <= 0 && particle.trail.length === 0) {
            Gravity.instance.particles.splice(i, 1);
            particle.quadtree.remove(particle);
        }
        else
            Gravity.instance.totalMass += particle.mass;
    }

    var foundNewLargest = false;
    for (i = Gravity.instance.particles.length - 1; i >= 0; i--) {
        particle = Gravity.instance.particles[i];
        if (largestParticle == null || particle.mass > largestParticle.mass) {
            largestParticle = particle;
            foundNewLargest = true;
        }
    }
    Gravity.instance.largestParticleIndex = Gravity.instance.particles.indexOf(largestParticle);
    if (Gravity.instance.Settings.followLargest && foundNewLargest) Gravity.clear();

    //Add more particles...
    if (Gravity.instance.Settings.generateParticles
        && Gravity.instance.generateParticleRateCount-- <= 1
        && Gravity.instance.processingTime < 500) {
        Gravity.instance.generateParticleRateCount = Gravity.instance.Settings.generateParticleRate;
        Gravity.generateParticles();
    }

    Gravity.endUpdateStatistics();
};

Gravity.generateParticles = function () {
    var angle = Math.random() * Math.PI * 2;
    var rand = Math.random();
    var i = Math.abs(Gravity.instance.Settings.generateParticleRandomizer);
    while (i--) rand *= Math.random();
    if (settings.generateParticleRandomizer > 0) rand = 1 - rand;
    var spawnSize = Gravity.instance.Settings.generateParticleArea * rand;
    var x = Math.cos(angle) * spawnSize;
    var y = Math.sin(angle) * spawnSize;
    var xm = Math.random() * Gravity.instance.Settings.generateParticleSpeed * 2 - Gravity.instance.Settings.generateParticleSpeed;
    var ym = Math.random() * Gravity.instance.Settings.generateParticleSpeed * 2 - Gravity.instance.Settings.generateParticleSpeed;
    var size = Gravity.instance.Settings.generateParticleSize / 2 + Gravity.instance.Settings.generateParticleSize * Math.random();
    Gravity.addParticle(x, y, xm, ym, size);
};
Gravity.draw = function () {
    Gravity.beginDrawTimer();
    if (Gravity.instance == null) return;
    if (Gravity.instance.Settings.paused) return;

    Gravity.startDrawStatistics();

    Gravity.setCenterXY();

    if (Keyboard.keys[187] || Keyboard.keys[107] || Keyboard.keys[61]) {
        Gravity.zoomIn(0.2);
    } else if (Keyboard.keys[189] || Keyboard.keys[109] || Keyboard.keys[173]) {
        Gravity.zoomOut(0.2);
    }
    if (Keyboard.keys[37])
        Gravity.instance.drawOffsetXT += 10 / Gravity.instance.drawScale;
    if (Keyboard.keys[38])
        Gravity.instance.drawOffsetYT += 10 / Gravity.instance.drawScale;
    if (Keyboard.keys[39])
        Gravity.instance.drawOffsetXT -= 10 / Gravity.instance.drawScale;
    if (Keyboard.keys[40])
        Gravity.instance.drawOffsetYT -= 10 / Gravity.instance.drawScale;

    if (Gravity.instance.drawScale !== Gravity.instance.drawScaleT) {

        Gravity.instance.drawScale += (Gravity.instance.drawScaleT - Gravity.instance.drawScale) * 0.2;
        if (Math.abs(Gravity.instance.drawScale - Gravity.instance.drawScaleT) < 0.001) Gravity.instance.drawScale = Gravity.instance.drawScaleT;
        Gravity.clear();
    }
    if (Gravity.instance.drawOffsetX !== Gravity.instance.drawOffsetXT || Gravity.instance.drawOffsetY !== Gravity.instance.drawOffsetYT) {
        Gravity.instance.drawOffsetX += ((Gravity.instance.drawOffsetXT - Gravity.instance.drawOffsetX) * 0.15);
        Gravity.instance.drawOffsetY += ((Gravity.instance.drawOffsetYT - Gravity.instance.drawOffsetY) * 0.15);
        if (Math.abs(Gravity.instance.drawOffsetX - Gravity.instance.drawOffsetXT) < 0.1) Gravity.instance.drawOffsetX = Gravity.instance.drawOffsetXT;
        if (Math.abs(Gravity.instance.drawOffsetY - Gravity.instance.drawOffsetYT) < 0.1) Gravity.instance.drawOffsetY = Gravity.instance.drawOffsetYT;
        if (!Gravity.instance.Settings.followLargest) Gravity.clear();
    }
    if (Gravity.instance.Settings.followLargest) {
        var largestParticle = Gravity.largestParticle();
        Gravity.instance.drawOffsetX = -largestParticle.x;
        Gravity.instance.drawOffsetY = -largestParticle.y;
        Gravity.instance.drawOffsetXT = -largestParticle.x;
        Gravity.instance.drawOffsetYT = -largestParticle.y;
    }

    if (Gravity.instance.Settings.trailType === 1)
        Gravity.clear();
    else if (Gravity.instance.Settings.trailType === 2 && Gravity.instance.Settings.trailLifetime !== 30
        && Gravity.instance.drawTrailCount++ >= Gravity.instance.Settings.trailLifetime) {
        Gravity.instance.drawTrailCount = 0;
        Gravity.context.fillStyle = 'rgba(0,0,0,' + (1 / (Gravity.instance.Settings.trailLifetime * 2)) + ')';
        Gravity.context.fillRect(0, 0, Gravity.canvas.width, Gravity.canvas.height);
    }

    for (var i = 0; i < Gravity.instance.particles.length; i++) {
        var particle = Gravity.instance.particles[i];
        if (particle != null)
            Particle.draw(particle, Gravity);
    }
    if (Gravity.instance.Settings.showQuadtree) Quadtree.instance.draw(Gravity);
    Gravity.drawui();

    Gravity.contextdisplay.fillStyle = 'rgba(0,0,0,1)';
    Gravity.contextdisplay.fillRect(0, 0, Gravity.canvasdisplay.width, Gravity.canvasdisplay.height);
    Gravity.contextdisplay.drawImage(Gravity.canvas, 0, 0, Gravity.canvas.width, Gravity.canvas.height);
    Gravity.contextdisplay.drawImage(Gravity.canvasui, 0, 0, Gravity.canvasui.width, Gravity.canvasui.height);

    Gravity.endDrawStatistics();
};
Gravity.drawui = function () {
    Gravity.clearui();
    if (Gravity.UI.unitPlacementStartX != null && settings.momentumAdd) {
        Gravity.contextui.strokeStyle = "rgba(255,255,255,.2)";
        Gravity.contextui.lineCap = 'round';
        Gravity.contextui.lineWidth = 2;
        Gravity.contextui.beginPath();
        Gravity.contextui.moveTo(Gravity.UI.mouseX, Gravity.UI.mouseY);
        Gravity.contextui.lineTo(Gravity.UI.unitPlacementStartX, Gravity.UI.unitPlacementStartY);
        Gravity.contextui.stroke();
        Gravity.contextui.closePath();
    }
};

Gravity.clear = function () {
    Gravity.context.fillStyle = "rgba(0,0,0,1)";
    Gravity.context.fillRect(0, 0, Gravity.canvas.width, Gravity.canvas.height);
};
Gravity.clearui = function () {
    Gravity.contextui.clearRect(0, 0, Gravity.canvasui.width, Gravity.canvasui.height);
};
Gravity.zoom = function (speed) {
    if (speed > 0)
        Gravity.zoomIn(speed);
    else
        Gravity.zoomOut(-speed);
};
Gravity.zoomOut = function (speed) {
    Gravity.instance.drawScaleT *= 1 - (0.1 * (speed != null ? speed : 1));
};
Gravity.zoomIn = function (speed) {
    Gravity.instance.drawScaleT /= 1 - (0.1 * (speed != null ? speed : 1));
};
Gravity.pan = function (x, y) {
    Gravity.instance.drawOffsetXT += x / Gravity.instance.drawScale * 2;
    Gravity.instance.drawOffsetYT += y / Gravity.instance.drawScale * 2;
};
Gravity.addParticle = function (x, y, xm, ym, mass) {
    var particle = new Particle(x, y);
    particle.xm = xm;
    particle.ym = ym;
    particle.mass = mass;
    Particle.initialize(particle);
    Gravity.instance.particles.push(particle);
    return particle;
};

Gravity.setCanvasSize = function () {
    Gravity.canvasdisplay.width =
        Gravity.canvasui.width =
            Gravity.canvas.width =
                $(window).width();
    Gravity.canvasdisplay.height =
        Gravity.canvasui.height =
            Gravity.canvas.height =
                $(window).height();
    Gravity.setCenterXY();
};

Gravity.largestParticle = function () {
    return Gravity.instance.particles[Gravity.instance.largestParticleIndex];
};
Gravity.particleCount = function () {
    return Gravity.instance.particles ? Gravity.instance.particles.length : 0;
};
Gravity.startDrawStatistics = function () {
    Gravity.instance.processingStart = Date.now();
};
Gravity.startUpdateStatistics = function () {
    Gravity.instance.processingStart = Date.now();
    Gravity.instance.frameLag = Date.now() - Gravity.instance.lastFrame - 1000 / Gravity.instance.Settings.fpsTarget;
    Gravity.instance.lastFrame = Date.now();
};
Gravity.endDrawStatistics = function () {
    Gravity.instance.processingCount += Date.now() - Gravity.instance.processingStart;
};
Gravity.endUpdateStatistics = function () {
    Gravity.instance.frameCount++;
    Gravity.instance.processingCount += Date.now() - Gravity.instance.processingStart + Gravity.instance.frameLag;
    if (Date.now() - 1000 > Gravity.instance.lastFrameReset) {
        Gravity.instance.lastFrameReset = Date.now();
        Gravity.instance.frameRate = Gravity.instance.frameCount;
        Gravity.instance.frameCount = 0;
        Gravity.instance.processingTime = Gravity.instance.processingCount;
        Gravity.instance.processingCount = 0;
    }
};

Gravity.translateCoordinate = function (x, y) {
    return {
        "x": x * Gravity.instance.drawScale,
        "y": y * Gravity.instance.drawScale
    };
};

Gravity.setShowTrail = function (value) {
    Gravity.instance.Settings.showTrail = value;
    if (value)
        Particle.draw = Particle.drawWithTrail;
    else
        Particle.draw = Particle.drawWithoutTrail;
};

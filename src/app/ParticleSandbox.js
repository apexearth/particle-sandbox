var Events = require('./Events');
var Quadtree = require('./Quadtree');
var Particle = require('./Particle');
var Keyboard = require('./Keyboard');
var settings = require("./Settings");
module.exports = PS;

PS.instance = {};

Events.addListener('AddParticle', function (coords) {
    if (PS.UI.unitPlacementStartX == null) return;
    var momentumX = 0;
    var momentumY = 0;
    if (settings.momentumAdd) {
        momentumX = (PS.UI.unitPlacementStartX - coords.x) / 60 / PS.instance.drawScale;
        momentumY = (PS.UI.unitPlacementStartY - coords.y) / 60 / PS.instance.drawScale;
    }
    PS.addParticle(
        (PS.UI.unitPlacementStartX - PS.instance.centerX) / PS.instance.drawScale - PS.instance.drawOffsetX,
        (PS.UI.unitPlacementStartY - PS.instance.centerY) / PS.instance.drawScale - PS.instance.drawOffsetY,
        momentumX,
        momentumY,
        10);
    PS.UI.unitPlacementStartX = null;
    PS.UI.unitPlacementStartY = null;
});

function PS() {
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

PS.UI = function () {
    this.unitPlacementStartX = null;
    this.unitPlacementStartY = null;
    this.mouseX = null;
    this.mouseY = null;
};


PS.beginUpdateTimer = function () {
    setTimeout(function () {PS.update();}, 1000 / PS.instance.Settings.fpsTarget);
};
PS.beginDrawTimer = function () {
    setTimeout(function () {PS.draw();}, 33);
};
PS.setCenterXY = function () {
    PS.instance.centerX = PS.canvas.width / 2;
    PS.instance.centerY = PS.canvas.height / 2;
};
PS.update = function () {
    PS.beginUpdateTimer();
    if (PS.instance == null) return;
    if (PS.instance.Settings.paused) return;

    PS.startUpdateStatistics();
    var i;
    for (i = 0; i < PS.instance.particles.length; i++)
        Particle.update(PS.instance.particles[i]);

    Quadtree.updateRoot(Particle);

    for (i = PS.instance.particles.length - 1; i >= 0; i--)
        Particle.updateInteract(PS.instance.particles[i]);

    var largestParticle = PS.largestParticle();

    PS.instance.totalMass = 0;
    var particle;
    for (i = PS.instance.particles.length - 1; i >= 0; i--) {
        particle = PS.instance.particles[i];
        if (particle.mass <= 0 && particle.trail.length === 0) {
            PS.instance.particles.splice(i, 1);
            particle.quadtree.remove(particle);
        }
        else
            PS.instance.totalMass += particle.mass;
    }

    var foundNewLargest = false;
    for (i = PS.instance.particles.length - 1; i >= 0; i--) {
        particle = PS.instance.particles[i];
        if (largestParticle == null || particle.mass > largestParticle.mass) {
            largestParticle = particle;
            foundNewLargest = true;
        }
    }
    PS.instance.largestParticleIndex = PS.instance.particles.indexOf(largestParticle);
    if (PS.instance.Settings.followLargest && foundNewLargest) PS.clear();

    //Add more particles...
    if (PS.instance.Settings.generateParticles
        && PS.instance.generateParticleRateCount-- <= 1
        && PS.instance.processingTime < 500) {
        PS.instance.generateParticleRateCount = PS.instance.Settings.generateParticleRate;
        PS.generateParticles();
    }

    PS.endUpdateStatistics();
};

PS.generateParticles = function () {
    var angle = Math.random() * Math.PI * 2;
    var rand = Math.random();
    var i = Math.abs(PS.instance.Settings.generateParticleRandomizer);
    while (i--) rand *= Math.random();
    if (settings.generateParticleRandomizer > 0) rand = 1 - rand;
    var spawnSize = PS.instance.Settings.generateParticleArea * rand;
    var x = Math.cos(angle) * spawnSize;
    var y = Math.sin(angle) * spawnSize;
    var xm = Math.random() * PS.instance.Settings.generateParticleSpeed * 2 - PS.instance.Settings.generateParticleSpeed;
    var ym = Math.random() * PS.instance.Settings.generateParticleSpeed * 2 - PS.instance.Settings.generateParticleSpeed;
    var size = PS.instance.Settings.generateParticleSize / 2 + PS.instance.Settings.generateParticleSize * Math.random();
    PS.addParticle(x, y, xm, ym, size);
};
PS.draw = function () {
    PS.beginDrawTimer();
    if (PS.instance == null) return;
    if (PS.instance.Settings.paused) return;

    PS.startDrawStatistics();

    PS.setCenterXY();

    if (Keyboard.keys[187] || Keyboard.keys[107] || Keyboard.keys[61]) {
        PS.zoomIn(0.2);
    } else if (Keyboard.keys[189] || Keyboard.keys[109] || Keyboard.keys[173]) {
        PS.zoomOut(0.2);
    }
    if (Keyboard.keys[37])
        PS.instance.drawOffsetXT += 10 / PS.instance.drawScale;
    if (Keyboard.keys[38])
        PS.instance.drawOffsetYT += 10 / PS.instance.drawScale;
    if (Keyboard.keys[39])
        PS.instance.drawOffsetXT -= 10 / PS.instance.drawScale;
    if (Keyboard.keys[40])
        PS.instance.drawOffsetYT -= 10 / PS.instance.drawScale;

    if (PS.instance.drawScale !== PS.instance.drawScaleT) {

        PS.instance.drawScale += (PS.instance.drawScaleT - PS.instance.drawScale) * 0.2;
        if (Math.abs(PS.instance.drawScale - PS.instance.drawScaleT) < 0.001) PS.instance.drawScale = PS.instance.drawScaleT;
        PS.clear();
    }
    if (PS.instance.drawOffsetX !== PS.instance.drawOffsetXT || PS.instance.drawOffsetY !== PS.instance.drawOffsetYT) {
        PS.instance.drawOffsetX += ((PS.instance.drawOffsetXT - PS.instance.drawOffsetX) * 0.15);
        PS.instance.drawOffsetY += ((PS.instance.drawOffsetYT - PS.instance.drawOffsetY) * 0.15);
        if (Math.abs(PS.instance.drawOffsetX - PS.instance.drawOffsetXT) < 0.1) PS.instance.drawOffsetX = PS.instance.drawOffsetXT;
        if (Math.abs(PS.instance.drawOffsetY - PS.instance.drawOffsetYT) < 0.1) PS.instance.drawOffsetY = PS.instance.drawOffsetYT;
        if (!PS.instance.Settings.followLargest) PS.clear();
    }
    if (PS.instance.Settings.followLargest) {
        var largestParticle = PS.largestParticle();
        PS.instance.drawOffsetX = -largestParticle.x;
        PS.instance.drawOffsetY = -largestParticle.y;
        PS.instance.drawOffsetXT = -largestParticle.x;
        PS.instance.drawOffsetYT = -largestParticle.y;
    }

    if (PS.instance.Settings.trailType === 1)
        PS.clear();
    else if (PS.instance.Settings.trailType === 2 && PS.instance.Settings.trailLifetime !== 30
        && PS.instance.drawTrailCount++ >= PS.instance.Settings.trailLifetime) {
        PS.instance.drawTrailCount = 0;
        PS.context.fillStyle = 'rgba(0,0,0,' + (1 / (PS.instance.Settings.trailLifetime * 2)) + ')';
        PS.context.fillRect(0, 0, PS.canvas.width, PS.canvas.height);
    }

    for (var i = 0; i < PS.instance.particles.length; i++) {
        var particle = PS.instance.particles[i];
        if (particle != null)
            Particle.draw(particle, PS);
    }
    if (PS.instance.Settings.showQuadtree) Quadtree.instance.draw(PS);
    PS.drawui();

    PS.contextdisplay.fillStyle = 'rgba(0,0,0,1)';
    PS.contextdisplay.fillRect(0, 0, PS.canvasdisplay.width, PS.canvasdisplay.height);
    PS.contextdisplay.drawImage(PS.canvas, 0, 0, PS.canvas.width, PS.canvas.height);
    PS.contextdisplay.drawImage(PS.canvasui, 0, 0, PS.canvasui.width, PS.canvasui.height);

    PS.endDrawStatistics();
};
PS.drawui = function () {
    PS.clearui();
    if (PS.UI.unitPlacementStartX != null && settings.momentumAdd) {
        PS.contextui.strokeStyle = "rgba(255,255,255,.2)";
        PS.contextui.lineCap = 'round';
        PS.contextui.lineWidth = 2;
        PS.contextui.beginPath();
        PS.contextui.moveTo(PS.UI.mouseX, PS.UI.mouseY);
        PS.contextui.lineTo(PS.UI.unitPlacementStartX, PS.UI.unitPlacementStartY);
        PS.contextui.stroke();
        PS.contextui.closePath();
    }
};

PS.clear = function () {
    PS.context.fillStyle = "rgba(0,0,0,1)";
    PS.context.fillRect(0, 0, PS.canvas.width, PS.canvas.height);
};
PS.clearui = function () {
    PS.contextui.clearRect(0, 0, PS.canvasui.width, PS.canvasui.height);
};
PS.zoom = function (speed) {
    if (speed > 0)
        PS.zoomIn(speed);
    else
        PS.zoomOut(-speed);
};
PS.zoomOut = function (speed) {
    PS.instance.drawScaleT *= 1 - (0.1 * (speed != null ? speed : 1));
};
PS.zoomIn = function (speed) {
    PS.instance.drawScaleT /= 1 - (0.1 * (speed != null ? speed : 1));
};
PS.pan = function (x, y) {
    PS.instance.drawOffsetXT += x / PS.instance.drawScale * 2;
    PS.instance.drawOffsetYT += y / PS.instance.drawScale * 2;
};
PS.addParticle = function (x, y, xm, ym, mass) {
    var particle = new Particle(x, y);
    particle.xm = xm;
    particle.ym = ym;
    particle.mass = mass;
    Particle.initialize(particle);
    PS.instance.particles.push(particle);
    return particle;
};

PS.setCanvasSize = function () {
    PS.canvasdisplay.width =
        PS.canvasui.width =
            PS.canvas.width =
                $(window).width();
    PS.canvasdisplay.height =
        PS.canvasui.height =
            PS.canvas.height =
                $(window).height();
    PS.setCenterXY();
};

PS.largestParticle = function () {
    return PS.instance.particles[PS.instance.largestParticleIndex];
};
PS.particleCount = function () {
    return PS.instance.particles ? PS.instance.particles.length : 0;
};
PS.startDrawStatistics = function () {
    PS.instance.processingStart = Date.now();
};
PS.startUpdateStatistics = function () {
    PS.instance.processingStart = Date.now();
    PS.instance.frameLag = Date.now() - PS.instance.lastFrame - 1000 / PS.instance.Settings.fpsTarget;
    PS.instance.lastFrame = Date.now();
};
PS.endDrawStatistics = function () {
    PS.instance.processingCount += Date.now() - PS.instance.processingStart;
};
PS.endUpdateStatistics = function () {
    PS.instance.frameCount++;
    PS.instance.processingCount += Date.now() - PS.instance.processingStart + PS.instance.frameLag;
    if (Date.now() - 1000 > PS.instance.lastFrameReset) {
        PS.instance.lastFrameReset = Date.now();
        PS.instance.frameRate = PS.instance.frameCount;
        PS.instance.frameCount = 0;
        PS.instance.processingTime = PS.instance.processingCount;
        PS.instance.processingCount = 0;
    }
};

PS.translateCoordinate = function (x, y) {
    return {
        "x": x * PS.instance.drawScale,
        "y": y * PS.instance.drawScale
    };
};

PS.setShowTrail = function (value) {
    PS.instance.Settings.showTrail = value;
    if (value)
        Particle.draw = Particle.drawWithTrail;
    else
        Particle.draw = Particle.drawWithoutTrail;
};

module.exports = new Settings();

function Settings() {
    this.generateParticles = false;
    this.generateParticleArea = 50000;
    this.generateParticleSpeed = 0;
    this.generateParticleRandomizer = -2;
    this.generateParticleRate = 6;
    this.generateParticleSize = 10;

    this.gravityProportion = 1;
    this.gravityExponential = 1;

    this.enableCollision = true;
    this.fpsTarget = 30;
    this.followLargest = false;
    this.trailLifetime = 4;
    this.showTrail = true;
    this.trailType = 1;
    this.showQuadtree = false;
    this.momentumAdd = true;
    this.paused = false;
}
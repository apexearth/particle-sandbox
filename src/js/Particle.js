var Quadtree = require("./Quadtree");
var General = require("./General");
var settings = require("./Settings");
module.exports = Particle;
function Particle(x, y) {
    this.mass = 0;
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.trail = [];
    this.compaction = 0;
    this.diameter = 0;
    this.radius = 0;
    this.radiusSq = 0;
    this.selfGravity = 0;
    this.xm = 0;
    this.ym = 0;
    this.pxm = 0;
    this.pym = 0;
    this.ignoreGravity = 0;
    this.ignoreCollisions = 0;
    this.interactQuad = 0;
    this.colorR = (75 + 180 * Math.random()).toFixed(0);
    this.colorB = (75 + 180 * Math.random()).toFixed(0);
    this.colorG = (75 + 180 * Math.random()).toFixed(0);
    Quadtree.instance.add(this);
}

Particle.quadtreeInteractDelay = 0;
Particle.initialize = function (me) {
    Particle.updateVariables(me);
};

Particle.updateMisc = function (me) {
    if (me.mass >= 50001) {
        me.compaction = (me.mass - 50000) / 200000;
        Particle.updateVariables(me);
    }
};
Particle.updateMovement = function (me) {
    var pqx = Math.floor(me.x / me.quadtree.d);
    var pqy = Math.floor(me.y / me.quadtree.d);
    me.x += me.xm;
    me.y += me.ym;
    if (pqx !== Math.floor(me.x / me.quadtree.d) || pqy !== Math.floor(me.y / me.quadtree.d)) {
        me.quadtree.remove(me);
        Quadtree.instance.add(me);
    }
};
Particle.update = function (me) {
    if (settings.showTrail && settings.trailType === 1) {
        Particle.updateTrail(me);
    } else {
        if (me.trail.length > 0) me.trail = [];
    }
    if (me.mass <= 0) return;
    Particle.updatePrevious(me);
    Particle.updateMisc(me);
    Particle.updateMovement(me);
};

Particle.updateInteractQuadtree = function (me) {
    me.interactQuad++;
    if (me.interactQuad >= Particle.quadtreeInteractDelay) return;
    var other, distance, far = me.quadtree.far, i = far.length;
    while (i--) {
        other = far[i];
        if (other.mass > 0) {
            distance = General.distance(me.x - other.x, me.y - other.y);
            Particle.applyGravity(me, other, distance, me.interactQuad);
        }
    }
    me.interactQuad = 0;
};
Particle.updateInteractNearby = function (me) {
    var other, distance, nearbyObjects = me.quadtree.nearbyObjects;
    var i = nearbyObjects.indexOf(me);

    while (i-- && i >= 0) {
        other = me.quadtree.nearbyObjects[i];
        if (other !== me && other.mass > 0) {
            distance = General.distance(me.x - other.x, me.y - other.y);

            if (distance <= me.radius + other.radius) { //Collision
                if (settings.enableCollision === true
                    && me.ignoreCollisions <= 0
                    && other.ignoreCollisions <= 0)
                    Particle.handleCollision(me, other);
            } else {
                Particle.applyGravityMutually(me, other, distance);
            }
            if (me.mass <= 0) return;
        }
    }
};
Particle.updateInteract = function (me) {
    if (me.mass <= 0) return;

    Particle.updateInteractQuadtree(me);

    Particle.updateInteractNearby(me);

    if (me.ignoreCollisions > 0) me.ignoreCollisions--;
    if (me.ignoreGravity > 0) me.ignoreGravity--;
};
Particle.updatePrevious = function (me) {
    me.px = me.x;
    me.py = me.y;
    me.pxm = me.xm;
    me.pym = me.ym;
};
Particle.updateTrail = function (me) {
    if (me.mass > 0) {
        me.trail.push({
            x: me.px,
            y: me.py,
            a: 1,
            diameter: me.diameter
        });
    }
    var i = me.trail.length;
    while (i--) {
        var trail = me.trail[i];
        trail.a -= 1 / settings.trailLifetime;
        if (trail.a < 0) me.trail.splice(i, 1);
    }
};
Particle.drawWithoutTrail = function (me, Gravity) {
    var position = Particle.getDrawVector(me.x, me.y, Gravity);
    Gravity.context.fillStyle = 'rgb(' + me.colorR + ',' + me.colorG + ',' + me.colorB + ')';
    General.drawCircle(Gravity.context, position.x, position.y, Math.max(0.5, me.radius * Gravity.instance.drawScale));
};
Particle.drawWithTrail = function (me, Gravity) {
    Gravity.canvas.lineCap = "round";
    var position3;
    if (settings.trailType === 1) {
        for (var i = 0; i < me.trail.length - 2; i += 2) {
            var trail1 = me.trail[i];
            var trail2 = me.trail[i + 1];
            var trail3 = me.trail[i + 2];
            var position1 = Particle.getDrawVector(trail1.x, trail1.y, Gravity);
            var position2 = Particle.getDrawVector(trail2.x, trail2.y, Gravity);
            position3 = Particle.getDrawVector(trail3.x, trail3.y, Gravity);
            Gravity.context.beginPath();
            Gravity.context.lineWidth = Math.max(0.5, trail1.diameter * Gravity.instance.drawScale);
            Gravity.context.moveTo(position1.x, position1.y);
            Gravity.context.quadraticCurveTo(position2.x, position2.y, position3.x, position3.y);
            Gravity.context.strokeStyle = 'rgba(' + me.colorR + ',' + me.colorG + ',' + me.colorB + ',' + trail3.a + ')';
            Gravity.context.stroke();
            Gravity.context.closePath();
        }
    }
    var position = Particle.getDrawVector(me.x, me.y, Gravity);
    var pposition = position3 || Particle.getDrawVector(me.px, me.py, Gravity);
    Gravity.context.beginPath();
    Gravity.context.moveTo(pposition.x, pposition.y);
    Gravity.context.lineTo(position.x, position.y);
    Gravity.context.lineWidth = Math.max(0.5, me.diameter * Gravity.instance.drawScale);
    Gravity.context.lineCap = "round";
    Gravity.context.strokeStyle = 'rgb(' + me.colorR + ',' + me.colorG + ',' + me.colorB + ')';
    Gravity.context.stroke();
    Gravity.context.closePath();
};
Particle.draw = Particle.drawWithoutTrail;

Particle.getDrawVector = function (x, y, Gravity) {
    return {
        x: (x + Gravity.instance.drawOffsetX) * Gravity.instance.drawScale + Gravity.instance.centerX,
        y: (y + Gravity.instance.drawOffsetY) * Gravity.instance.drawScale + Gravity.instance.centerY
    };
};
Particle.applyGravityMutually = function (me, other, distance) {
    if (distance === 0) return;
    if (me.ignoreGravity > 0 || other.ignoreGravity > 0) return;
    var gravityMetric = distance * (1 + distance * settings.gravityExponential);

    var dirx = me.x - other.x;
    var diry = me.y - other.y;
    var hyp = Math.sqrt(dirx * dirx + diry * diry);
    dirx /= hyp;
    diry /= hyp;

    var otherGravity = (other.mass / gravityMetric) * settings.gravityProportion;
    var meGravity = (me.mass / gravityMetric) * settings.gravityProportion;

    me.xm -= dirx * otherGravity;
    me.ym -= diry * otherGravity;
    other.xm += dirx * meGravity;
    other.ym += diry * meGravity;

};
Particle.applyGravity = function (me, other, distance, proportion) {
    if (distance === 0) return;
    var gravityMetric = distance * (1 + distance * settings.gravityExponential);

    var dirx = me.x - other.x;
    var diry = me.y - other.y;
    var hyp = Math.sqrt(dirx * dirx + diry * diry);
    dirx /= hyp;
    diry /= hyp;

    var otherGravity = (other.mass / gravityMetric) * settings.gravityProportion * proportion;
    me.xm -= dirx * otherGravity;
    me.ym -= diry * otherGravity;

};
Particle.handleCollision = function (me, other) {

    //var angle = General.AngleRad(me.px, me.py, other.px, other.py);
    //var vPrime = General.Distance(other.pxm-me.pxm, other.pym-me.pym);

    Particle.spreadVelocity(me, other, Math.min(me.mass, other.mass) / 2);
    Particle.MassExchange(me, other);

    //if (vPrime > 3 && me.mass > other.mass * .1) Particle.breakParticle(me, vPrime, other);
    //if (vPrime > 3 && other.mass > me.mass * .1) Particle.breakParticle(other, vPrime, me);

    //if (!Particle.hasMass(me) || !Particle.hasMass(other)) return;

    //if (me.mass > other.mass) {
    //    Particle.unCollide(other, me);
    //    Particle.unCollideAll(other);
    //} else {
    //    Particle.unCollide(me, other);
    //    Particle.unCollideAll(me);
    //}
};
Particle.MassExchange = function (me, other) {
    var xferAmount;
    if (me.mass > other.mass) {
        xferAmount = Math.min(other.mass, Math.max(other.mass * (me.mass / other.mass) / 100, 0.1));
        me.mass += xferAmount;
        other.mass -= xferAmount;
    } else {
        xferAmount = Math.min(me.mass, Math.max(me.mass * (other.mass / me.mass) / 100, 0.1));
        me.mass -= xferAmount;
        other.mass += xferAmount;
    }
    Particle.updateVariables(me);
    Particle.updateVariables(other);
};
Particle.spreadVelocity = function (me, other, mass) {
    var mexm = me.xm;
    var meym = me.ym;
    var meProportion = mass / (me.mass + mass);
    var otherProportion = mass / (other.mass + mass);
    me.xm = me.xm * (1 - meProportion) + other.xm * meProportion;
    me.ym = me.ym * (1 - meProportion) + other.ym * meProportion;
    other.xm = other.xm * (1 - otherProportion) + mexm * otherProportion;
    other.ym = other.ym * (1 - otherProportion) + meym * otherProportion;
};
Particle.updateVariables = function (me) {
    me.diameter = Math.sqrt((1 + me.mass) / (1 + me.compaction));
    me.radius = me.diameter * 0.5;
    me.radiusSq = me.radius * me.radius;
    var gravityMetric = me.diameter * (1 + me.diameter * settings.gravityExponential);
    me.selfGravity = (me.mass / gravityMetric) * settings.gravityProportion / 4;
};

//Unused bits
Particle.pullCenter = function (me) {
    var distance = 1 + General.distance(me.x, me.y);
    var angle = General.angleRad(me.x, me.y, 0, 0);
    me.xm += Math.cos(angle) * (distance * 0.00000001);
    me.ym += Math.sin(angle) * (distance * 0.00000001);
};
Particle.explode = function (me, Gravity) {
    var explosiveForce = 2 + Math.log(me.selfGravity);
    var i = 10;
    while (i-- && me.mass > 0) {
        var forceRand = (1 - Math.random() * Math.random() * Math.random());
        var rand = Math.random() * Math.PI * 2;
        var mass = 10 + 100 * Math.random();
        me.mass -= mass;
        var newParticle = Gravity.addParticle(me.x, me.y,
            Math.cos(rand) * (forceRand * explosiveForce) + me.xm,
            Math.sin(rand) * (forceRand * explosiveForce) + me.ym,
            mass);
        newParticle.ignoreCollisions = 60;
        newParticle.ignoreGravity = 60;
    }
};
Particle.breakParticle = function (me, other, Gravity) {
    if (Gravity.instance.particles.length > 200) return;
    var breakMass = 50 + other.mass / me.mass;
    while (me.mass > breakMass) {
        me.mass -= other.mass;
        Gravity.addParticle(
            me.x,
            me.y,
            me.xm,
            me.ym,
            Math.min(me.mass, 10 + me.mass * Math.random())
        );
    }
};
Particle.unCollide = function (me, other) {
    var angle = General.angleRad(me.x, me.y, other.x, other.y);
    me.x = other.x - Math.cos(angle) * (me.radius + other.radius + 2);
    me.y = other.y - Math.sin(angle) * (me.radius + other.radius + 2);
};
Particle.unCollideAll = function (me, Gravity) {
    var other, distance;
    for (var i = Gravity.instance.particles.length - 1; i >= 0; i--) {
        other = Gravity.instance.particles[i];
        if (me !== other) {
            distance = General.distance(me.x - other.x, me.y - other.y);
            if (distance < me.radius + other.radius) {
                if (me.mass > other.mass) {
                    Particle.unCollide(other, me);
                } else {
                    Particle.unCollide(me, other);
                }
            }
        }
    }
};

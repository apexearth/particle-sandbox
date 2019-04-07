export default {
    angle          : function (x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1)
    },
    angleDeg       : function (x1, y1, x2, y2) {
        return this.angle(y2 - y1, x2 - x1) * 180 / Math.PI
    },
    leadingAngle   : function (x1, y1, speed1, x2, y2, x2v, y2v) {
        let a    = Math.pow(x2v, 2) + Math.pow(y2v, 2) - Math.pow(speed1, 2)
        let b    = 2 * (x2v * (x2 - x1) + y2v * (y2 - y1))
        let c    = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
        let disc = Math.pow(b, 2) - 4 * a * c
        let t1   = (-b + Math.sqrt(disc)) / (2 * a)
        let t2   = (-b - Math.sqrt(disc)) / (2 * a)
        let t    = (t1 < t2 && t1 > 0 ? t1 : t2)
        if (isNaN(t)) return this.angle(x1, y1, x2, y2)
        let aimTargetX = t * x2v + x2
        let aimTargetY = t * y2v + y2
        return this.angle(x1, y1, aimTargetX, aimTargetY)
    },
    leadingAngleDeg: function (x1, y1, speed1, x2, y2, x2v, y2v) {
        return this.leadingAngle(x1, y1, speed1, x2, y2, x2v, y2v) * 180 / Math.PI
    },
    leadingVector  : function (x1, y1, speed1, x2, y2, x2v, y2v) {
        let a    = Math.pow(x2v, 2) + Math.pow(y2v, 2) - Math.pow(speed1, 2)
        let b    = 2 * (x2v * (x2 - x1) + y2v * (y2 - y1))
        let c    = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
        let disc = Math.pow(b, 2) - 4 * a * c
        let t1   = (-b + Math.sqrt(disc)) / (2 * a)
        let t2   = (-b - Math.sqrt(disc)) / (2 * a)
        let t    = (t1 < t2 && t1 > 0 ? t1 : t2)
        if (isNaN(t)) return this.angle(x1, y1, x2, y2)
        let aimTargetX = t * x2v + x2
        let aimTargetY = t * y2v + y2
        return {x: aimTargetX, y: aimTargetY}
    },
    randomAngle    : function (min, max) {
        return Math.random() * (max - min) + min
    },
    randomAngleDeg : function (min, max) {
        return (Math.random() * (max - min) + min) * Math.PI / 180
    }
}

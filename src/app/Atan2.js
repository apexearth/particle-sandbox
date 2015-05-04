/* jshint -W016 */
module.exports = new Atan2();

function Atan2(){
    this.ATAN2_BITS = 6;

    this.ATAN2_BITS2 = Math.floor(this.ATAN2_BITS << 1);
    this.ATAN2_MASK = Math.floor(~(-1 << this.ATAN2_BITS2));
    this.ATAN2_COUNT = Math.floor(this.ATAN2_MASK + 1);
    this.ATAN2_DIM = Math.floor(Math.sqrt(this.ATAN2_COUNT));

    this.INV_ATAN2_DIM_MINUS_1 = 1.0 / (this.ATAN2_DIM - 1);
    this.DEG = 180.0 / Math.PI;

    this.atan2Array = new Array(this.ATAN2_COUNT);

    for (var i = 0; i < this.ATAN2_DIM; i++)
    {
        for (var j = 0; j < this.ATAN2_DIM; j++)
        {
            var x0 = i / this.ATAN2_DIM;
            var y0 = j / this.ATAN2_DIM;

            this.atan2Array[j * this.ATAN2_DIM + i] = Math.atan2(y0, x0);
        }
    }
}
Atan2.prototype.atan2Deg = function(y, x) {
    return this.atan2(y, x) * this.DEG;
};
Atan2.prototype.atan2 = function(y, x) {
    var add, mul;

    if (x < 0.0) {
        if (y < 0.0) {
            x = -x;
            y = -y;
            mul = 1.0;
        } else {
            x = -x;
            mul = -1.0;
        }

        add = -3.141592653;
    } else {
        if (y < 0.0) {
            y = -y;
            mul = -1.0;
        } else {
            mul = 1.0;
        }

        add = 0.0;
    }

    var invDiv = 1.0 / (((x < y) ? y : x) * this.INV_ATAN2_DIM_MINUS_1);

    var xi = Math.floor((x * invDiv));
    var yi = Math.floor((y * invDiv));

    return (this.atan2Array[yi * this.ATAN2_DIM + xi] + add) * mul;
};

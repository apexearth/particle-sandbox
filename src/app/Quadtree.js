var General = require("./General");
var Quadtree;
module.exports = {
    instance: null,
    initializeQuadtree: initializeQuadtree,
    clear: clear,
    updateRoot: updateRoot
};
function initializeQuadtree(gravity) {
    module.exports.instance = Quadtree = new QuadtreeSector(null, 0, 0);
    var particles = gravity.particles, i = particles.length;
    while (i--) Quadtree.add(particles[i]);
}
function clear(gravity) {
    var pArray = gravity.particles;
    var k = pArray.length;
    while (k--) pArray[k].quadtree = null;
    module.exports.instance = Quadtree = new QuadtreeSector(null, 0, 0);
}
function updateRoot(Particle) {
    Particle.quadtreeInteractDelay = Math.sqrt(this.instance.all.length) * 2;
    var k = this.instance.all.length;
    while (k--) this.instance.all[k].update();
    this.instance.requiresUpdate = false;
}
//------------------------------------------------------------------------------
function QuadtreeSector(parent, x, y) {
    if (isNaN(x) || isNaN(y)) return;
    if (parent == null) {
        this.all = [];
        this.tree = [];
        this.children = [];
        this.requiresUpdate = false;
    }
    else {
        this.parent = parent;
        this.configureAsChild();
    }

    if (parent == null) {
        this.d = 1E5;
    } else {
        this.d = parent.cd;
    }
    this.left = x;
    this.top = y;
    this.cd = this.d / 2;

    this.mass = 0;

    this.count = 0;
}
QuadtreeSector.prototype.update = function () {
    this.calculate();
    if (Quadtree.requiresUpdate) {
        this.updateNearby();
        this.updateFar();
    }
};
QuadtreeSector.prototype.updateNearby = function () {
    this.nearby = [];
    this.nearbyObjects = [];
    var x = this.left;
    var y = this.top;

    for (var ix = x - 1; ix <= x + 1; ix++) {
        for (var iy = y - 1; iy <= y + 1; iy++) {
            var temp = Quadtree.getSector(ix * this.d, iy * this.d, this.d, false);
            if (temp != null && this.nearby.indexOf(temp) === -1) {
                this.nearby.push(temp);
                var allObj = temp.getAllObjects();
                var k = allObj.length;
                while (k--) this.nearbyObjects.push(allObj[k]);
            }
        }
    }
};
QuadtreeSector.prototype.updateFar = function () {
    this.far = [];
    var i = Quadtree.all.length;
    while (i--) {
        var temp = Quadtree.all[i];
        if (this.nearby.indexOf(temp) === -1) {
            var j = this.nearby.length, check = true;
            while (j--) {
                if (this.nearby[j].getAllChildren().indexOf(temp) >= 0) check = false;
            }
            if (check) this.far.push(temp);
        }
    }
};
QuadtreeSector.prototype.draw = function (PS) {
    var context = PS.context;
    var i = Quadtree.all.length;
    while (i--) {
        var tree = this.all[i];
        if (tree.objects != null) {
            var coords = PS.translateCoordinate(tree.left * tree.d + PS.instance.drawOffsetX, tree.top * tree.d + PS.instance.drawOffsetY);
            var lengths = PS.translateCoordinate(tree.d, tree.d);
            context.strokeStyle = "rgba(50,50,50,1)";
            context.lineWidth = "1px";
            context.strokeRect(coords.x + PS.instance.centerX, coords.y + PS.instance.centerY, lengths.x, lengths.y);

            coords = PS.translateCoordinate(tree.x + PS.instance.drawOffsetX, tree.y + PS.instance.drawOffsetY);
            context.fillStyle = "rgba(255,0,0,1)";
            General.drawCircle(PS.context, coords.x + PS.instance.centerX, coords.y + PS.instance.centerY, 2);
        }
    }
};

QuadtreeSector.prototype.calculate = function () {
    if (this.objects == null || this.objects.length === 0) {
        this.x = this.y = this.mass = 0;
    } else {
        var i = this.objects.length;
        this.x = this.y = this.mass = 0;
        while (i--) {
            var obj = this.objects[i];
            this.x += obj.x * obj.mass;
            this.y += obj.y * obj.mass;
            this.mass += obj.mass;
        }
        this.x /= this.mass;
        this.y /= this.mass;
    }
};

QuadtreeSector.prototype.configureAsChild = function () {
    if (this.parent.children.indexOf(this) === -1) {
        this.parent.children.push(this);
        // Order for consistency
        var i = this.parent.children.length;
        while (i-- > 1) {
            var c1 = this.parent.children[i];
            var c2 = this.parent.children[i - 1];
            if (c1.left < c2.left || c1.left === c2.left && c1.top < c2.top) {
                this.parent.children.push(this.parent.children.splice(i - 1, 1)[0]);
            }
        }
    }

    this.tree = null;
    this.children = null;
    this.objects = [];
    this.nearbyObjects = [];
    this.nearby = [];
    this.far = [];
    Quadtree.requiresUpdate = true;
};
QuadtreeSector.prototype.configureAsParent = function () {
    this.tree = [];
    this.children = [];
    var i = this.objects.length;
    while (i--) {
        var obj = this.objects.pop();
        obj.quadtree = null;
        this.getSector(obj.x, obj.y, 0, true).add(obj);
    }
    this.objects = null;
    this.nearbyObjects = null;
    this.nearby = null;
    this.far = null;
    Quadtree.requiresUpdate = true;
};
QuadtreeSector.prototype.convertToParent = function () {
    //if (this.tree != null) console.log("convertToParent called when already a parent");
    this.configureAsParent();
    Quadtree.all.splice(Quadtree.all.indexOf(this), 1);
};

QuadtreeSector.prototype.getSector = function (x, y, dimension, create) {
    var tree = this;
    while (tree.tree != null) {
        var fx = Math.floor(x / tree.cd), fy = Math.floor(y / tree.cd);
        var treeX = tree.tree[fx];
        if (!create && treeX == null) return null;
        if (treeX == null) {
            treeX = tree.tree[fx] = [];
            tree = treeX[fy] = new QuadtreeSector(tree, fx, fy);
        } else {
            var treeY = treeX[fy];
            if (!create && treeY == null) return null;
            tree = treeX[fy] = (treeY != null ? treeY : new QuadtreeSector(tree, fx, fy));
        }
        if (tree.d === dimension) break;
    }
    return tree;
};
QuadtreeSector.prototype.getAllChildren = function () {
    if (this.children == null) return [];
    var i = this.children.length, array = [];
    while (i--) {
        var child = this.children[i];
        array.push(child);
        var childsChildren = child.getAllChildren();
        var k = childsChildren.length;
        while (k--) array.push(childsChildren[k]);
    }
    return array;
};
QuadtreeSector.prototype.getAllObjects = function () {
    if (this.objects)
        return this.objects;
    else {
        var i = this.children.length, array = [];
        while (i--) {
            var objects = this.children[i].getAllObjects();
            var j = objects.length - 1, k = -1;
            while (k++ < j) array.push(objects[k]);
        }
        return array;
    }
};

QuadtreeSector.prototype.add = function (obj) {
    var tree = this;
    tree.count++;
    while (tree.tree != null) {
        tree = tree.getSector(obj.x, obj.y, tree.cd, true);
        if (tree.count >= 16 && tree.tree == null) {
            tree.convertToParent();
            //console.log("Converting child to parent. Parent Objects: " + tree.parent.count + " My Objects: " + tree.count);
        }
        tree.count++;
    }

    tree.objects.push(obj);
    obj.quadtree = tree;
    if (tree.nearby.length > 0) {
        var k = tree.nearby.length;
        while (k--) {
            var nearby = tree.nearby[k];
            if (nearby.nearbyObjects != null)
                nearby.nearbyObjects.push(obj);
        }
    } else {
        Quadtree.requiresUpdate = true;
    }
    tree.calculate();

    if (tree.count === 1) {
        if (Quadtree.all.indexOf(tree) === -1) {
            Quadtree.all.push(tree);
            var i = Quadtree.all.length;
            while (i-- > 1) {
                var c1 = Quadtree.all[i];
                var c2 = Quadtree.all[i - 1];
                if (c1.left < c2.left || c1.left === c2.left && c1.top < c2.top) {
                    Quadtree.all.push(Quadtree.all.splice(i - 1, 1)[0]);
                }
            }
            //console.log("[Add] [Quadtree No Longer Empty] Objects: " + tree.count + " " + tree.objects.length);
        }
    }
    //console.log("[Add] Parent Objects: " + tree.parent.count + " My Objects: " + tree.count);
};
QuadtreeSector.prototype.remove = function (obj) {
    var objIndex = this.objects.indexOf(obj);
    //if (objIndex == -1)
    //    console.log("Attempted to remove an object from where it was not!");
    //if (this.count == 0)
    //    console.log("about to negative a quadtree");
    this.count--;

    this.objects.splice(objIndex, 1);
    obj.quadtree = null;
    var t = this.nearbyObjects.indexOf(obj);
    if (t > -1) this.nearbyObjects.splice(t, 1);

    var k = this.nearby.length;
    while (k--) {
        var nearby = this.nearby[k];
        if (nearby.nearbyObjects != null) {
            t = nearby.nearbyObjects.indexOf(obj);
            if (t > -1) nearby.nearbyObjects.splice(t, 1);
        }
    }

    if (this.count === 0) {
        t = Quadtree.all.indexOf(this);
        if (t > -1) Quadtree.all.splice(t, 1);
        Quadtree.requiresUpdate = true;
        //console.log("[Remove] [Quadtree Empty] Objects: " + this.count + " " + this.objects.length);
    }

    var parent = this.parent;
    while (parent != null) {
        //if (parent.count == 0)
        //    console.log("about to negative a quadtree");
        parent.count--;
        if (parent.count === 0 && parent.parent != null) {
            //console.log("Converting parent to child. Parent Objects: " + parent.count + " My Objects: " + this.count);
            parent.configureAsChild();
        }
        parent = parent.parent;
    }
    //console.log("[Remove] Parent Objects: " + this.parent.count + " My Objects: " + this.count);
};


const PIXI = typeof window !== 'undefined' ? require('pixi.js') : null

let id = 0

class SandboxObject {

    constructor({parent, position, momentum}) {
        if (!parent) throw new Error('No parent recieved.')
        this.id     = id++
        this.parent = parent
        this.type   = 'object'
        position    = position || {x: 0, y: 0}
        momentum    = momentum || {x: 0, y: 0}

        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container()
            this.graphics  = new PIXI.Graphics()
            this.container.addChild(this.graphics)
        } else {
            this.container = {position: {x: 0, y: 0}, scale: {x: 1, y: 1}, width: 1, height: 1}
        }

        this.position.x = position.x
        this.position.y = position.y
        this.momentum   = {
            x: momentum.x,
            y: momentum.y
        }
        this._selected  = false
        this.removed    = false
    }

    get position() {
        return this.container.position
    }

    get scale() {
        return this.container.scale
    }

    get selected() {
        return this._selected
    }

    select() {
        if (!this._selected) {
            this._selected = true
            this.draw()
        }
    }

    deselect() {
        if (this._selected) {
            this._selected = false
            this.draw()
        }
    }

    selectionHitTest(minX, minY, maxX, maxY) {
        return !(
            this.position.x + this.container.width / 2 < minX ||
            this.position.x - this.container.height / 2 > maxX ||
            this.position.y + this.container.width / 2 < minY ||
            this.position.y - this.container.height / 2 > maxY
        )
    }

    draw() {
        if (typeof window !== 'undefined') {
            this.graphics.clear()
            this.graphics.beginFill(this._selected ? 0xff0000 : 0xff66666)
            this.graphics.drawCircle(0, 0, 1)
            this.graphics.endFill()
            this.scale.x = this.scale.y = 10
        }
    }
}

module.exports = SandboxObject

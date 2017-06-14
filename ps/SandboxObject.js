const PIXI = typeof window !== 'undefined' ? require('pixi.js') : null

class SandboxObject {
    constructor({parent, position}) {
        if (!parent) throw new Error('No parent recieved.')
        this.parent = parent
        position    = position || {x: 0, y: 0}

        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container()
            this.graphics  = new PIXI.Graphics()
            this.container.addChild(this.graphics)
        } else {
            this.container = {position: {x: 0, y: 0}, scale: {x: 1, y: 1}}
        }

        this.position.x = position.x
        this.position.y = position.y
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

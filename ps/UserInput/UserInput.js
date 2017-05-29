const PIXI   = typeof window !== 'undefined' ? require('pixi.js') : null
const inputs = require('../inputs')
const modes  = require('./modes')

class UserInput {
    constructor({parent}) {
        if (!parent) throw new Error('No parent recieved.')
        this.ps = parent
        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container()
            this.graphics  = new PIXI.Graphics()
            this.container.addChild(this.graphics)
            this.ps.root.addChild(this.container)
        }
        this.mode  = "create"
        this.state = {}

        this.lastMouseX = inputs('mouseX')
        this.lastMouseY = inputs('mouseY')
    }

    static get modes() {
        return modes
    }

    update(seconds) {
        const {ps}        = this
        const {container} = ps

        if (this.mode !== this.state.mode) {
            // Initialize the state for the current mode.
            this.state = {mode: this.mode}
        }

        UserInput.modes[this.mode].update(seconds, this.state, this.ps)

        if (inputs('mouse2')) {
            container.position.x += inputs('mouseX') - this.lastMouseX
            container.position.y += inputs('mouseY') - this.lastMouseY
        }

        let scrollSpeed = 6
        if (inputs('up')) {
            container.position.y += scrollSpeed
        }
        if (inputs('down')) {
            container.position.y -= scrollSpeed
        }
        if (inputs('left')) {
            container.position.x += scrollSpeed
        }
        if (inputs('right')) {
            container.position.x -= scrollSpeed
        }
        let zoomSpeed = .02
        if (inputs('zoomOut')) {
            ps.zoom(-zoomSpeed)
        }
        if (inputs('zoomIn')) {
            ps.zoom(zoomSpeed)
        }

        this.draw()

        this.lastMouseX = inputs('mouseX')
        this.lastMouseY = inputs('mouseY')
    }

    draw() {
        if (typeof window === 'undefined') return
        this.graphics.clear()
        UserInput.modes[this.mode].draw(this.state, this.graphics)
    }
}

module.exports = UserInput
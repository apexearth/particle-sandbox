const PIXI   = typeof window !== 'undefined' ? require('pixi.js') : null
const inputs = require('./inputs')

const modes = {
    select: 'select',
    create: 'create'
}

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
        this.mode  = "select"
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
            this.state = {
                mode  : this.mode,
                stage : 0,
                start : {x: 0, y: 0},
                finish: {x: 0, y: 0}
            }
        }

        if (this.mode === "select") {
            if (inputs('mouse0')) {
                if (!this.state.stage) {
                    this.state.stage = 1
                    // TODO: This takes the current x/y from the frame, not the actual mouse click event's x/y, thus user might experience frustration.
                    // Should fix later -- don't want to do a hack right now.
                    this.state.start.x = inputs('mouseX')
                    this.state.start.y = inputs('mouseY')
                }
                this.state.finish.x = inputs('mouseX')
                this.state.finish.y = inputs('mouseY')
            } else if (this.state.stage) {
                this.state.stage    = 0
                this.state.finish.x = inputs('mouseX')
                this.state.finish.y = inputs('mouseY')
                this.ps.select(this.state.start.x, this.state.start.y, this.state.finish.x, this.state.finish.y)
            }
        } else if (this.mode === "create") {
            if (inputs('mouse2')) {
                this.state.stage = 0
            } else if (inputs('mouse0')) {
                if (!this.state.stage) {
                    this.state.stage    = 1
                    this.state.timeHeld = 0
                    this.state.start.x  = inputs('mouseX')
                    this.state.start.y  = inputs('mouseY')
                    this.state.particle = this.ps.previewParticle()
                }
                this.state.finish.x = inputs('mouseX')
                this.state.finish.y = inputs('mouseY')

                if (Math.sqrt(Math.pow(this.state.finish.x - this.state.start.x, 2) + Math.pow(this.state.finish.y - this.state.start.y, 2)) < 10) {
                    this.state.timeHeld += seconds
                }
                this.state.particle.position.x                 = (this.state.start.x - this.ps.position.x) / this.ps.scale.x
                this.state.particle.position.y                 = (this.state.start.y - this.ps.position.y) / this.ps.scale.y
                this.state.particle.radius = (2 + 10 * this.state.timeHeld) / this.ps.scale.x
                this.state.particle.draw()

            } else if (this.state.stage) {
                this.state.stage             = 0
                this.state.finish.x          = inputs('mouseX')
                this.state.finish.y          = inputs('mouseY')
                this.state.particle.momentum = {
                    x: (this.state.start.x - this.state.finish.x) / this.ps.scale.x,
                    y: (this.state.start.y - this.state.finish.y) / this.ps.scale.x
                }
                this.ps.addParticle(this.state.particle)
            }
        }


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
        if (this.state.stage === 0) return
        if (this.mode === "select") {
            this.graphics.beginFill(0x99ff99, .03)
            this.graphics.lineStyle(1, 0x99ff99, .5)
            this.graphics.drawRect(
                this.state.start.x, this.state.start.y,
                this.state.finish.x - this.state.start.x, this.state.finish.y - this.state.start.y
            )
            this.graphics.endFill()
        } else if (this.mode === "create") {
            this.graphics.lineStyle(1, 0x99ff99, .5)
            this.graphics.moveTo(this.state.start.x, this.state.start.y)
            this.graphics.lineTo(this.state.finish.x, this.state.finish.y)
            this.graphics.endFill()
        }
    }
}

module.exports = UserInput
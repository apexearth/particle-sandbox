const PIXI   = typeof window !== 'undefined' ? require('pixi.js') : null;
const inputs = require('./inputs');

class UserInput {
    constructor({parent}) {
        if (!parent) throw new Error('No parent recieved.')
        this.parent = parent
        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container()
            this.graphics  = new PIXI.Graphics()
            this.container.addChild(this.graphics)
            this.parent.root.addChild(this.container)
        }
        this.mode  = "selection"
        this.state = {}
    }

    update(seconds) {
        if (this.mode !== this.state.mode) {
            // Initialize the state for the current mode.
            this.state = {
                mode     : this.mode,
                selecting: false,
                start    : {x: 0, y: 0},
                finish   : {x: 0, y: 0}
            };
        }

        if (this.mode === "selection") {
            if (inputs('mouse0')) {
                if (!this.state.selecting) {
                    this.state.selecting = true
                    // TODO: This takes the current x/y from the frame, not the actual mouse click event's x/y, thus user might experience frustration.
                    // Should fix later -- don't want to do a hack right now.
                    this.state.start.x = inputs('mouseX')
                    this.state.start.y = inputs('mouseY')
                }
                this.state.finish.x = inputs('mouseX')
                this.state.finish.y = inputs('mouseY')
            } else if (this.state.selecting) {
                this.state.selecting = false;
                this.parent.select(this.state.start.x, this.state.start.y, this.state.finish.x, this.state.finish.y)
            }
        }
        this.draw()
    }

    draw() {
        if (typeof window === 'undefined') return
        this.graphics.clear()
        if (this.mode === "selection") {
            if (!this.state.selecting) return
            this.graphics.beginFill(0x99ff99, .03)
            this.graphics.lineStyle(1, 0x99ff99, .5)
            this.graphics.drawRect(
                this.state.start.x, this.state.start.y,
                this.state.finish.x - this.state.start.x, this.state.finish.y - this.state.start.y
            )
            this.graphics.endFill()
        }
    }
}

module.exports = UserInput;
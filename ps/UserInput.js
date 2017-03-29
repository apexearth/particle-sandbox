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
            this.parent.container.addChild(this.container)
        }
    }

    update(seconds) {

        this.draw()
    }

    draw() {

    }
}

module.exports = UserInput;
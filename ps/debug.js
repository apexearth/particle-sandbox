const PIXI  = require('pixi.js')
const stats = require('./stats')

const fpsText = new PIXI.Text(stats.fps, {fill: "white", align: 'left'})

module.exports = {
    initialize: stage => {
        stage.addChild(fpsText)
    },
    update    : current => {
        if (Math.floor(stats.fpsStart / 1000) !== Math.floor(current / 1000)) {
            stats.fps        = stats.fpsCounter
            stats.fpsStart   = current
            stats.fpsCounter = 0
        }
        stats.fpsCounter++

        clear()
        print('FPS:   ' + stats.fps)
        print('Count: ' + stats.particleCount)
    }
}

const clear = () => fpsText.text = ''
const print = text => fpsText.text += text + '\n'
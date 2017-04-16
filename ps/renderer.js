const ui       = require('./ui')
const input    = require('./inputs')
const stats    = require('./stats')
const debug    = require('./debug')
const PIXI     = require('pixi.js')
const renderer = new PIXI.WebGLRenderer(screenWidth(), screenHeight(), {antialias: true})
module.exports = renderer
document.body.appendChild(renderer.view)

function screenWidth() {
    return typeof window !== 'undefined' ? window.innerWidth : 500
}

function screenHeight() {
    return typeof window !== 'undefined' ? window.innerHeight : 500
}

const ParticleSandbox = require('./ParticleSandbox')
const ps              = new ParticleSandbox()
if (typeof window !== 'undefined') window.ps = ps
ui.initialize(ps)

function zoom(zoomSpeed) {
    if (zoomSpeed < 0 && stage.scale.y > .5) {
        stage.position.x += (stage.position.x - window.innerWidth / 2) * zoomSpeed / stage.scale.y
        stage.position.y += (stage.position.y - window.innerHeight / 2) * zoomSpeed / stage.scale.y
        stage.scale.x = stage.scale.y = stage.scale.y + zoomSpeed
    }
    if (zoomSpeed > 0 && stage.scale.y < 4) {
        stage.position.x += (stage.position.x - window.innerWidth / 2) * zoomSpeed / stage.scale.y
        stage.position.y += (stage.position.y - window.innerHeight / 2) * zoomSpeed / stage.scale.y
        stage.scale.x = stage.scale.y = stage.scale.y + zoomSpeed
    }
}

let lastMouseX = input('mouseX')
let lastMouseY = input('mouseY')
let last       = Date.now()
function animate() {
    requestAnimationFrame(animate)
    let current = Date.now()
    let time    = Math.min((current - last) / 1000, 30 / 1000)
    ps.update(time)
    last = current
    if (window.innerWidth !== renderer.view.width || window.innerHeight !== renderer.view.height) {
        renderer.resize(window.innerWidth, window.innerHeight)
    }

    if (input('mouse2')) {
        stage.position.x += input('mouseX') - lastMouseX
        stage.position.y += input('mouseY') - lastMouseY
    }

    let scrollSpeed = 6
    if (input('up')) {
        stage.position.y += scrollSpeed
    }
    if (input('down')) {
        stage.position.y -= scrollSpeed
    }
    if (input('left')) {
        stage.position.x += scrollSpeed
    }
    if (input('right')) {
        stage.position.x -= scrollSpeed
    }
    let zoomSpeed = .02
    if (input('zoomOut')) {
        zoom(-zoomSpeed)
    }
    if (input('zoomIn')) {
        zoom(zoomSpeed)
    }

    renderer.render(root)
    debug.update(current)

    lastMouseX = input('mouseX')
    lastMouseY = input('mouseY')
}

const addParticles = () => {
    ps.addParticles(20)
    if (ps.particles.length < 1000) {
        setTimeout(addParticles, 10)
    }
}
addParticles()

let root  = ps.root
let stage = ps.container
debug.initialize(stage)

document.addEventListener('mousewheel', event => zoom(event.deltaY < 0 ? .1 : -.1))

animate()
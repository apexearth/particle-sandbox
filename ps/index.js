const input    = require('./inputs');
const PIXI     = require('pixi.js');
const renderer = new PIXI.WebGLRenderer(width(), height());
document.body.appendChild(renderer.view);

const ParticleSandbox = require('./ParticleSandbox');
const ps              = new ParticleSandbox()
if (typeof window !== 'undefined') window.ps = ps;
let p1 = ps.addParticle({mass: 5, position: {x: 0, y: 0}})
let p2 = ps.addParticle({mass: 2, position: {x: 2, y: 0}})
let p3 = ps.addParticle({mass: 2, position: {x: 0, y: 2}})

//for (let i = 0; i < 100; i++) {
//    ps.addParticle({
//        mass: 20 + Math.random() * 10,
//        position: {
//            x: 500 * Math.random() - 250,
//            y: 500 * Math.random() - 250,
//        }
//    });
//}

function width() {
    return typeof window !== 'undefined' ? window.innerWidth : 500;
}
function height() {
    return typeof window !== 'undefined' ? window.innerHeight : 500;
}


let stage      = ps.container;
let lastMouseX = input('mouseX');
let lastMouseY = input('mouseY');
let last       = Date.now()
document.addEventListener('mousewheel', zoom);

function zoom(event) {
    let change = (event.deltaY > 0 ? .2 : -.2);
    if (change > 0 && stage.scale.y > .2) {
        stage.position.x -= (stage.position.x - window.innerWidth / 2) * change / stage.scale.y;
        stage.position.y -= (stage.position.y - window.innerHeight / 2) * change / stage.scale.y;
        stage.scale.x = stage.scale.y = Math.max(.2, stage.scale.y - change);
    }
    if (change < 0 && stage.scale.y < 4) {
        stage.position.x += (input('mouseX') - window.innerWidth / 2) * change;
        stage.position.y += (input('mouseY') - window.innerHeight / 2) * change;
        stage.scale.x = stage.scale.y = Math.min(4, stage.scale.y - change);
    }
}

function animate() {
    requestAnimationFrame(animate)
    let current = Date.now()
    let time    = Math.min((current - last) / 1000, 30 / 1000);
    ps.update(time)
    last = current
    if (window.innerWidth !== renderer.view.width || window.innerHeight !== renderer.view.height) {
        renderer.resize(window.innerWidth, window.innerHeight);
    }

    if (input('mouse2')) {
        stage.position.x += input('mouseX') - lastMouseX;
        stage.position.y += input('mouseY') - lastMouseY;
    }

    let scrollSpeed = 6;
    if (input('up')) {
        stage.position.y += scrollSpeed;
    }
    if (input('down')) {
        stage.position.y -= scrollSpeed;
    }
    if (input('left')) {
        stage.position.x += scrollSpeed;
    }
    if (input('right')) {
        stage.position.x -= scrollSpeed;
    }
    let zoomSpeed = .02;
    if (input('zoomOut') && stage.scale.y > .2) {
        stage.position.x -= (stage.position.x - window.innerWidth / 2) * zoomSpeed / stage.scale.y;
        stage.position.y -= (stage.position.y - window.innerHeight / 2) * zoomSpeed / stage.scale.y;
        stage.scale.x = stage.scale.y = Math.max(.2, stage.scale.y - zoomSpeed);
    }
    if (input('zoomIn') && stage.scale.y < 4) {
        stage.position.x += (stage.position.x - window.innerWidth / 2) * zoomSpeed / stage.scale.y;
        stage.position.y += (stage.position.y - window.innerHeight / 2) * zoomSpeed / stage.scale.y;
        stage.scale.x = stage.scale.y = Math.min(4, stage.scale.y + zoomSpeed);
    }

    renderer.render(stage);
    lastMouseX = input('mouseX');
    lastMouseY = input('mouseY');
}
animate();

ps.container.position.x = width() / 2;
ps.container.position.y = height() / 2;
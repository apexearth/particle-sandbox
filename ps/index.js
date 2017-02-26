var input    = require('./inputs');
var PIXI     = require('pixi.js');
var renderer = new PIXI.WebGLRenderer(width(), height());
document.body.appendChild(renderer.view);

var ParticleSandbox = require('./ParticleSandbox');
var ps              = new ParticleSandbox()
for (var i = 0; i < 500; i++) {
    ps.addParticle({
        position: {
            x: 2000 * Math.random() - 1000,
            y: 2000 * Math.random() - 1000,
        }
    });
}

function width() {
    return typeof window !== 'undefined' ? window.innerWidth : 500;
}
function height() {
    return typeof window !== 'undefined' ? window.innerHeight : 500;
}


var stage      = ps.container;
var lastMouseX = input('mouseX');
var lastMouseY = input('mouseY');
var last       = Date.now()
document.addEventListener('mousewheel', zoom);

function zoom(event) {
    var change = (event.deltaY > 0 ? .2 : -.2);
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
    let time    = Math.min((current - last) / 1000, 1000 / 30);
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
    var zoomSpeed = .02;
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